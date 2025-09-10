import React, { useState, useCallback, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LostFoundReport, UserRole } from '../types';
import { ImageZoomModal } from '../components/ui/ImageZoomModal';
import { autofillReportForm, analyzeReportImage } from '../services/geminiService';
import { Spinner } from '../components/ui/Spinner';
import { MOCK_LOST_FOUND_REPORTS } from '../data/mockData';
import { generateReportPdf } from '../services/pdfService';
import { useToast } from '../hooks/useToast';

type ReportStep = 'instructions' | 'form' | 'review' | 'confirmation';
type ReportType = 'Lost' | 'Found';
type ReportCategory = 'Person' | 'Item';
type ReportSubCategory = 'Bags & Luggage' | 'Electronics' | 'Documents & Cards' | 'Jewelry & Accessories' | 'Other';

const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 2.293-2.293a1 1 0 011.414 0L17 14m-5-5l2.293 2.293a1 1 0 010 1.414L10 17" /></svg>;
const NextStepIcon = ({ step }: { step: string }) => (
    <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
      {step}
    </div>
);


/**
 * Page for reporting a lost or found person/item.
 * This component implements a single form with integrated AI assistance features.
 * It's a protected route, requiring login to access.
 */
const ReportLostFoundPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { translations } = useLocalization();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [step, setStep] = useState<ReportStep>('instructions');
  const [agreed, setAgreed] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('Lost');
  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [subCategory, setSubCategory] = useState<ReportSubCategory | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [lastSeen, setLastSeen] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Person-specific state
  const [personName, setPersonName] = useState('');
  const [personAge, setPersonAge] = useState('');
  const [personGender, setPersonGender] = useState('');
  const [clothingAppearance, setClothingAppearance] = useState('');

  // Item-specific state
  const [itemName, setItemName] = useState('');
  const [itemBrand, setItemBrand] = useState('');
  const [itemColor, setItemColor] = useState('');
  const [itemMaterial, setItemMaterial] = useState('');
  const [itemSize, setItemSize] = useState('');
  const [identifyingMarks, setIdentifyingMarks] = useState('');
  
  // Review state
  const [reportToReview, setReportToReview] = useState<LostFoundReport | null>(null);

  // Confirmation state
  const [submittedReport, setSubmittedReport] = useState<LostFoundReport | null>(null);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }

  const buildReportForReview = (): LostFoundReport => {
      if (!user) throw new Error("User not found");
      
      const effectiveCategory = category || (personName ? 'Person' : 'Item');

      return {
        id: `RPT-${Date.now()}`, // Temporary ID
        type: reportType,
        category: effectiveCategory,
        description,
        lastSeen,
        reportedBy: user.name,
        reportedById: user.id,
        timestamp: new Date().toISOString(),
        status: 'Open',
        imageUrl: imageBase64 || undefined,
        locationCoords: {
            lat: 23.1793 + (Math.random() - 0.5) * 0.2,
            lng: 75.7873 + (Math.random() - 0.5) * 0.2,
        },
        ...(effectiveCategory === 'Person' && { personName, personAge, personGender, clothingAppearance }),
        ...(effectiveCategory === 'Item' && { itemName, itemBrand, itemColor, identifyingMarks, subCategory, itemMaterial, itemSize }),
    };
  }
  
  const handleAnalyze = async (b64: string, preselectedCategory: ReportCategory | null) => {
    if (!b64) return;
    setIsAnalyzing(true);
    try {
        const data = await analyzeReportImage(b64);

        // Validation check: If a category is pre-selected by the user, verify it matches the AI's analysis.
        if (preselectedCategory && data.category && preselectedCategory !== data.category) {
            addToast(
                `Image Mismatch: AI detected a '${data.category}' but you selected '${preselectedCategory}'. Please change your selection or upload a different photo.`,
                'error'
            );
            setIsAnalyzing(false);
            return; // Stop the process
        }
        
        const wasAutodetected = !preselectedCategory;

        // If validation passes, proceed to fill the form
        if (data.category) setCategory(data.category);
        if (data.subCategory) setSubCategory(data.subCategory);
        if (data.description) setDescription(prev => `${data.description} ${prev}`.trim());
        if (data.personName) setPersonName(data.personName);
        if (data.personAge) setPersonAge(data.personAge);
        if (data.personGender) setPersonGender(data.personGender);
        if (data.clothingAppearance) setClothingAppearance(data.clothingAppearance);
        if (data.itemName) setItemName(data.itemName);
        if (data.itemBrand) setItemBrand(data.itemBrand);
        if (data.itemColor) setItemColor(data.itemColor);
        if (data.itemMaterial) setItemMaterial(data.itemMaterial);
        if (data.itemSize) setItemSize(data.itemSize);
        if (data.identifyingMarks) setIdentifyingMarks(data.identifyingMarks);

        if(wasAutodetected && data.category) {
            addToast(`AI auto-detected a ${data.category} and pre-filled the form.`, "success");
        } else {
            addToast("Photo analyzed and form pre-filled!", "success");
        }
    } catch (error) {
        console.error("AI Image Analysis failed:", error);
        addToast("AI Image Analysis failed. Please fill the form manually.", 'error');
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleFile = (file: File) => {
      if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const b64 = reader.result as string;
              setImageBase64(b64);
              // If category is not set, run analysis automatically.
              if (!category) {
                handleAnalyze(b64, null);
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          handleFile(e.target.files[0]);
      }
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
      }
  }, [category]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);
  }, []);

  const handleTakePhotoClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    if (!user?.settings?.cameraAccess) {
        e.preventDefault();
        addToast("Camera access is disabled in your profile settings.", "error");
    }
  };

  const removeImage = () => {
    setImageBase64(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !category) return;
    const reportData = buildReportForReview();
    setReportToReview(reportData);
    setStep('review');
  }

  const handleSubmit = () => {
      if(!reportToReview) return;
      MOCK_LOST_FOUND_REPORTS.unshift(reportToReview);
      sessionStorage.setItem('focusOnReportId', reportToReview.id);
      setSubmittedReport(reportToReview);
      setStep('confirmation');
  };

  const handleAutofill = async () => {
    if (!aiPrompt.trim()) return;
    setIsAutofilling(true);
    try {
        const data = await autofillReportForm(aiPrompt);
        if (data.type) setReportType(data.type);
        if (data.category) setCategory(data.category);
        if (data.subCategory) setSubCategory(data.subCategory);
        if (data.description) setDescription(data.description);
        if (data.lastSeen) setLastSeen(data.lastSeen);
        if (data.personName) setPersonName(data.personName);
        if (data.personAge) setPersonAge(data.personAge);
        if (data.personGender) setPersonGender(data.personGender);
        if (data.clothingAppearance) setClothingAppearance(data.clothingAppearance);
        if (data.itemName) setItemName(data.itemName);
        if (data.itemBrand) setItemBrand(data.itemBrand);
        if (data.itemColor) setItemColor(data.itemColor);
        if (data.itemMaterial) setItemMaterial(data.itemMaterial);
        if (data.itemSize) setItemSize(data.itemSize);
        if (data.identifyingMarks) setIdentifyingMarks(data.identifyingMarks);
        addToast("Form has been autofilled by AI!", "success");
    } catch (error) {
        console.error("AI autofill failed:", error);
        addToast("AI autofill failed. Please fill the form manually.", 'error');
    } finally {
        setIsAutofilling(false);
    }
  };

  const handleDownload = () => {
    if (!submittedReport) return;
    generateReportPdf(submittedReport);
  };

  const resetForm = () => {
    setStep('instructions');
    setAgreed(false);
    setReportType('Lost');
    setCategory(null);
    setSubCategory(undefined);
    setDescription('');
    setLastSeen('');
    setImageBase64(null);
    setPersonName('');
    setPersonAge('');
    setPersonGender('');
    setClothingAppearance('');
    setItemName('');
    setItemBrand('');
    setItemColor('');
    setItemMaterial('');
    setItemSize('');
    setIdentifyingMarks('');
    setSubmittedReport(null);
    setReportToReview(null);
    setAiPrompt('');
  }

  const renderReportSummary = (report: LostFoundReport) => (
       <Card className="text-left bg-gray-50/50 dark:bg-gray-800/50">
            <h4 className="font-bold text-lg mb-3 border-b pb-2">{translations.report.reportSummary}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {report.imageUrl && (
                    <div className="md:col-span-1">
                        <img src={report.imageUrl} alt="Uploaded" className="rounded-lg shadow-md w-full object-cover aspect-square" />
                    </div>
                )}
                <div className={`space-y-2 text-sm ${report.imageUrl ? 'md:col-span-2' : 'md:col-span-3'}`}>
                    <p><strong>{translations.myReports.id}:</strong> <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">{report.id}</span></p>
                    <p><strong>{translations.report.type}:</strong> {report.type}</p>
                    <p><strong>{translations.report.category}:</strong> {report.category}</p>
                    {report.subCategory && <p><strong>{translations.report.subCategory}:</strong> {report.subCategory}</p>}
                    {report.personName && <p><strong>{translations.report.personName}:</strong> {report.personName}</p>}
                    {report.personAge && <p><strong>{translations.report.personAge}:</strong> {report.personAge}</p>}
                    {report.personGender && <p><strong>{translations.report.personGender}:</strong> {report.personGender}</p>}
                    {report.clothingAppearance && <p><strong>{translations.report.clothingAppearance}:</strong> {report.clothingAppearance}</p>}
                    {report.itemName && <p><strong>{translations.report.itemName}:</strong> {report.itemName}</p>}
                    {report.itemBrand && <p><strong>{translations.report.itemBrand}:</strong> {report.itemBrand}</p>}
                    {report.itemColor && <p><strong>{translations.report.itemColor}:</strong> {report.itemColor}</p>}
                    {report.itemMaterial && <p><strong>{translations.report.itemMaterial.replace(' (optional)', '')}:</strong> {report.itemMaterial}</p>}
                    {report.itemSize && <p><strong>{translations.report.itemSize.replace(' (optional)', '')}:</strong> {report.itemSize}</p>}
                    {report.identifyingMarks && <p><strong>{translations.report.identifyingMarks}:</strong> {report.identifyingMarks}</p>}
                    <p><strong>{translations.report.lastSeen}:</strong> {report.lastSeen}</p>
                    <p><strong>{translations.report.description}:</strong> {report.description}</p>
                </div>
            </div>
        </Card>
  );

  const renderStep = () => {
    switch (step) {
      case 'instructions':
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold">{translations.report.instructions}</h3>
            <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300">
              <ul>
                <li>Provide as much detail as possible.</li>
                <li>For missing persons, include clothing, age, and height if known.</li>
                <li>For items, describe color, brand, and any identifying marks.</li>
                <li>Do not file false reports. Misuse will result in account suspension.</li>
              </ul>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
              <label htmlFor="agree" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">{translations.report.accept}</label>
            </div>
            <Button onClick={() => setStep('form')} disabled={!agreed}>{translations.report.next}</Button>
          </div>
        );
      case 'form':
        return (
         <>
          <form onSubmit={handleReview} className="space-y-6 animate-fade-in">
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{translations.report.type}</label>
              <div className="flex gap-4">
                <Button type="button" variant={reportType === 'Lost' ? 'primary' : 'secondary'} onClick={() => setReportType('Lost')}>{translations.report.lost}</Button>
                <Button type="button" variant={reportType === 'Found' ? 'primary' : 'secondary'} onClick={() => setReportType('Found')}>{translations.report.found}</Button>
              </div>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{translations.report.category}</label>
              <div className="flex gap-4">
                <Button type="button" variant={category === 'Person' ? 'primary' : 'secondary'} onClick={() => setCategory('Person')}>{translations.report.person}</Button>
                <Button type="button" variant={category === 'Item' ? 'primary' : 'secondary'} onClick={() => setCategory('Item')}>{translations.report.item}</Button>
              </div>
            </div>

             {/* AI Assistance Section */}
            <Card className="bg-orange-50/50 dark:bg-gray-800/50">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">AI Smart Fill <span className="text-sm font-normal">(Optional)</span></h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translations.report.aiPromptLabel}</label>
                        <textarea id="ai-prompt" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} rows={4} className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.aiPromptPlaceholder}/>
                        <Button type="button" onClick={handleAutofill} disabled={isAutofilling || !aiPrompt.trim()} className="mt-2">
                            {isAutofilling ? <Spinner size="sm" /> : <><SparklesIcon /> {translations.report.aiFillButton}</>}
                        </Button>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translations.report.upload}</label>
                        {imageBase64 ? (
                             <div className="mt-2 relative">
                                <img src={imageBase64} alt="Upload preview" className="w-full h-auto max-h-60 object-contain rounded-md bg-gray-100 dark:bg-gray-700 p-2" />
                                <Button type="button" variant="danger" className="absolute top-2 right-2 px-2 py-1 text-xs" onClick={removeImage}>{translations.report.removeImage}</Button>
                             </div>
                        ) : (
                            <div onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} className={`mt-1 p-4 border-2 border-dashed rounded-md transition-colors ${isDraggingOver ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{translations.report.uploadOrDrag}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                        <label htmlFor="file-upload" className="w-full cursor-pointer bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 font-semibold py-2 px-4 border border-orange-400 dark:border-orange-600 rounded-md hover:bg-orange-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"><span>{translations.report.uploadPrompt}</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" ref={fileInputRef} /></label>
                                        <label htmlFor="camera-upload" onClick={handleTakePhotoClick} className="w-full cursor-pointer bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 font-semibold py-2 px-4 border border-orange-400 dark:border-orange-600 rounded-md hover:bg-orange-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"><span>{translations.report.takePhoto}</span><input id="camera-upload" name="camera-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" capture="environment"/></label>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Button type="button" onClick={() => handleAnalyze(imageBase64!, category)} disabled={isAnalyzing || !imageBase64} className="mt-2">
                             {isAnalyzing ? <Spinner size="sm" /> : <><SparklesIcon /> {translations.report.analyze}</>}
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600"></div></div>
                <div className="relative flex justify-center"><span className="bg-orange-50 dark:bg-gray-900 px-3 text-sm text-gray-500">Or Fill Details Manually</span></div>
            </div>
            
            {/* Manual Entry Fields */}
            <Card>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Report Details</h3>
                {category ? (
                    <div className="space-y-4 animate-fade-in">
                        {category === 'Person' && (
                        <div className="space-y-4">
                            <div><label htmlFor="personName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translations.report.personName}</label><input type="text" id="personName" value={personName} onChange={e => setPersonName(e.target.value)} required className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.personNamePlaceholder} /></div>
                            <div><label htmlFor="personAge" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translations.report.personAge}</label><input type="text" id="personAge" value={personAge} onChange={e => setPersonAge(e.target.value)} required className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.personAgePlaceholder} /></div>
                            <div><label htmlFor="personGender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translations.report.personGender}</label><select id="personGender" value={personGender} onChange={e => setPersonGender(e.target.value)} required className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-orange-500 focus:ring-orange-500"><option value="">{translations.report.selectGender}</option><option value="Male">{translations.report.male}</option><option value="Female">{translations.report.female}</option><option value="Other">{translations.report.other}</option></select></div>
                            <div><label htmlFor="clothingAppearance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translations.report.clothingAppearance}</label><textarea id="clothingAppearance" value={clothingAppearance} onChange={e => setClothingAppearance(e.target.value)} required rows={2} className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.clothingAppearancePlaceholder}></textarea></div>
                        </div>
                        )}

                        {category === 'Item' && (
                        <div className="space-y-4">
                            <div><label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translations.report.subCategory}</label><select id="subCategory" value={subCategory || ''} onChange={e => setSubCategory(e.target.value as ReportSubCategory)} required className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-orange-500 focus:ring-orange-500"><option value="">{translations.report.selectSubCategory}</option><option value="Bags & Luggage">{translations.report.subCategories.bags}</option><option value="Electronics">{translations.report.subCategories.electronics}</option><option value="Documents & Cards">{translations.report.subCategories.documents}</option><option value="Jewelry & Accessories">{translations.report.subCategories.jewelry}</option><option value="Other">{translations.report.subCategories.other}</option></select></div>
                            <div><label htmlFor="itemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translations.report.itemName}</label><input type="text" id="itemName" value={itemName} onChange={e => setItemName(e.target.value)} required className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.itemNamePlaceholder} /></div>
                            <div><label htmlFor="itemBrand" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translations.report.itemBrand}</label><input type="text" id="itemBrand" value={itemBrand} onChange={e => setItemBrand(e.target.value)} className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.itemBrandPlaceholder} /></div>
                            <div><label htmlFor="itemColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translations.report.itemColor}</label><input type="text" id="itemColor" value={itemColor} onChange={e => setItemColor(e.target.value)} className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.itemColorPlaceholder} /></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="itemMaterial" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translations.report.itemMaterial}</label>
                                    <input type="text" id="itemMaterial" value={itemMaterial} onChange={e => setItemMaterial(e.target.value)} className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.itemMaterialPlaceholder} />
                                </div>
                                <div>
                                    <label htmlFor="itemSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translations.report.itemSize}</label>
                                    <input type="text" id="itemSize" value={itemSize} onChange={e => setItemSize(e.target.value)} className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.itemSizePlaceholder} />
                                </div>
                            </div>
                            <div><label htmlFor="identifyingMarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translations.report.identifyingMarks}</label><input type="text" id="identifyingMarks" value={identifyingMarks} onChange={e => setIdentifyingMarks(e.target.value)} className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.identifyingMarksPlaceholder} /></div>
                        </div>
                        )}
                        
                        <div><label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translations.report.description}</label><textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.descriptionPlaceholder}></textarea></div>
                        <div><label htmlFor="lastSeen" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translations.report.lastSeen}</label><input type="text" id="lastSeen" value={lastSeen} onChange={e => setLastSeen(e.target.value)} required className="mt-1 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.lastSeenPlaceholder} /></div>
                    </div>
                ) : (
                    <div className="text-center py-10 px-4 border-2 border-dashed rounded-md">
                        <p className="text-gray-500 dark:text-gray-400">Please select a "Person" or "Item" category above to see the relevant fields.</p>
                    </div>
                )}
            </Card>

            <Button type="submit" className="w-full text-lg mt-6" disabled={!category}>{translations.report.reviewButton}</Button>
          </form>
          {imageBase64 && (
            <ImageZoomModal 
                isOpen={isZoomModalOpen}
                onClose={() => setIsZoomModalOpen(false)}
                imageUrl={imageBase64}
            />
          )}
          </>
        );
      case 'review':
        if (!reportToReview) return null;
        return (
            <div className="space-y-4 animate-fade-in">
                 <h3 className="text-2xl font-bold text-center">{translations.report.reviewTitle}</h3>
                 <p className="text-center text-gray-600 dark:text-gray-400">{translations.report.reviewSubtitle}</p>
                 {renderReportSummary(reportToReview)}
                 <div className="flex gap-4 justify-center pt-4">
                    <Button onClick={() => setStep('form')} variant="secondary">{translations.report.editButton}</Button>
                    <Button onClick={handleSubmit}>{translations.report.confirmSubmitButton}</Button>
                </div>
            </div>
        )
      case 'confirmation':
        if (!submittedReport) return null;
        const tNext = translations.report.whatHappensNext;
        return (
            <div className="text-center space-y-6 p-4 animate-fade-in">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full mx-auto flex items-center justify-center animate-pulse">
                    <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{translations.report.confirmationSuccessTitle}</h3>
                <p className="text-gray-600 dark:text-gray-300">{translations.report.confirmationSuccessText}</p>
                <div className="text-left bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                    <h4 className="font-bold text-lg mb-3 text-center">{tNext.title}</h4>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4"><NextStepIcon step="1" /><p>{tNext.step1}</p></div>
                        <div className="flex items-start gap-4"><NextStepIcon step="2" /><p>{tNext.step2}</p></div>
                        <div className="flex items-start gap-4"><NextStepIcon step="3" /><p>{tNext.step3}</p></div>
                    </div>
                </div>
                {renderReportSummary(submittedReport)}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button onClick={() => navigate('/dashboard')} variant="primary">{translations.report.viewOnMapButton}</Button>
                    <Button onClick={handleDownload} variant="secondary">{translations.report.downloadButton}</Button>
                    <Button onClick={resetForm} variant="secondary">{translations.report.newReport}</Button>
                </div>
            </div>
        )
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mx-auto">
        <Card>
            <h2 className="text-3xl font-bold text-center mb-6">{translations.report.title}</h2>
            {renderStep()}
        </Card>
      </div>
    </div>
  );
};

export default ReportLostFoundPage;