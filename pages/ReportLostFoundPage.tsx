import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LostFoundReport } from '../types';
import { ImageZoomModal } from '../components/ui/ImageZoomModal';
import { autofillReportForm, analyzeReportImage } from '../services/geminiService';
import { Spinner } from '../components/ui/Spinner';
import { MOCK_LOST_FOUND_REPORTS } from '../data/mockData';

type ReportStep = 'instructions' | 'form' | 'review' | 'confirmation';
type ReportType = 'Lost' | 'Found';
type ReportCategory = 'Person' | 'Item';

const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 2.293-2.293a1 1 0 011.414 0L17 14m-5-5l2.293 2.293a1 1 0 010 1.414L10 17" /></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;


/**
 * Page for reporting a lost or found person/item.
 * This component implements a multi-step form to guide the user through the reporting process.
 * It's a protected route, requiring login to access.
 */
const ReportLostFoundPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { translations } = useLocalization();

  // Form state
  const [step, setStep] = useState<ReportStep>('instructions');
  const [agreed, setAgreed] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('Lost');
  const [category, setCategory] = useState<ReportCategory>('Person');
  const [description, setDescription] = useState('');
  const [lastSeen, setLastSeen] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);


  // Person-specific state
  const [personName, setPersonName] = useState('');
  const [personAge, setPersonAge] = useState('');
  const [personGender, setPersonGender] = useState('');
  const [clothingAppearance, setClothingAppearance] = useState('');

  // Item-specific state
  const [itemName, setItemName] = useState('');
  const [itemBrand, setItemBrand] = useState('');
  const [itemColor, setItemColor] = useState('');
  const [identifyingMarks, setIdentifyingMarks] = useState('');
  
  // Review state
  const [reportToReview, setReportToReview] = useState<LostFoundReport | null>(null);

  // Confirmation state
  const [submittedReport, setSubmittedReport] = useState<LostFoundReport | null>(null);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const reportData: LostFoundReport = {
        id: `RPT-${Date.now()}`, // Temporary ID
        type: reportType,
        category,
        description,
        lastSeen,
        reportedBy: user.name,
        reportedById: user.id,
        timestamp: new Date().toISOString(),
        status: 'Open',
        imageUrl: imageBase64 || undefined,
        ...(category === 'Person' && { personName, personAge, personGender, clothingAppearance }),
        ...(category === 'Item' && { itemName, itemBrand, itemColor, identifyingMarks }),
    };
    setReportToReview(reportData);
    setStep('review');
  }

  const handleSubmit = () => {
      if(!reportToReview) return;
      MOCK_LOST_FOUND_REPORTS.unshift(reportToReview);
      setSubmittedReport(reportToReview);
      setStep('confirmation');
  };

  const handleAutofill = async () => {
      if(!aiPrompt.trim()) return;
      setIsAutofilling(true);
      try {
          const autofilledData = await autofillReportForm(aiPrompt);
          if (autofilledData.type) setReportType(autofilledData.type);
          if (autofilledData.category) setCategory(autofilledData.category);
          if (autofilledData.description) setDescription(autofilledData.description);
          if (autofilledData.lastSeen) setLastSeen(autofilledData.lastSeen);
          if (autofilledData.personName) setPersonName(autofilledData.personName);
          if (autofilledData.personAge) setPersonAge(autofilledData.personAge);
          if (autofilledData.personGender) setPersonGender(autofilledData.personGender);
          if (autofilledData.clothingAppearance) setClothingAppearance(autofilledData.clothingAppearance);
          if (autofilledData.itemName) setItemName(autofilledData.itemName);
          if (autofilledData.itemBrand) setItemBrand(autofilledData.itemBrand);
          if (autofilledData.itemColor) setItemColor(autofilledData.itemColor);
      } catch (error) {
          console.error("AI autofill failed:", error);
          alert("AI autofill failed. Please fill the form manually.");
      } finally {
          setIsAutofilling(false);
      }
  };

  const handleAnalyzeImage = async () => {
    if (!imageBase64) return;
    setIsAnalyzing(true);
    try {
        const analysisData = await analyzeReportImage(imageBase64);
        // Populate form fields with AI data
        if (analysisData.type) setReportType(analysisData.type);
        if (analysisData.category) setCategory(analysisData.category);
        if (analysisData.description) setDescription(prev => `${analysisData.description} ${prev}`.trim());
        if (analysisData.personName) setPersonName(analysisData.personName);
        if (analysisData.personAge) setPersonAge(analysisData.personAge);
        if (analysisData.personGender) setPersonGender(analysisData.personGender);
        if (analysisData.clothingAppearance) setClothingAppearance(analysisData.clothingAppearance);
        if (analysisData.itemName) setItemName(analysisData.itemName);
        if (analysisData.itemBrand) setItemBrand(analysisData.itemBrand);
        if (analysisData.itemColor) setItemColor(analysisData.itemColor);
        if (analysisData.identifyingMarks) setIdentifyingMarks(analysisData.identifyingMarks);
    } catch (error) {
        console.error("AI Image Analysis failed:", error);
        alert("AI Image Analysis failed. Please fill the form manually.");
    } finally {
        setIsAnalyzing(false);
    }
  };


  const generateReportText = (report: LostFoundReport): string => {
    let content = `** Simhastha Sahayata - Report Summary **\n\n`;
    content += `Report ID: ${report.id}\n`;
    content += `Date: ${new Date(report.timestamp).toLocaleString()}\n`;
    content += `Status: ${report.status}\n\n`;
    content += `--- Details ---\n`;
    content += `Type: ${report.type}\n`;
    content += `Category: ${report.category}\n`;
    content += `Last Seen: ${report.lastSeen}\n`;
    
    if (report.category === 'Person') {
        content += `Person's Name: ${report.personName || 'N/A'}\n`;
        content += `Approx. Age: ${report.personAge || 'N/A'}\n`;
        content += `Gender: ${report.personGender || 'N/A'}\n`;
        content += `Clothing/Appearance: ${report.clothingAppearance || 'N/A'}\n`;
    } else {
        content += `Item Name: ${report.itemName || 'N/A'}\n`;
        content += `Brand: ${report.itemBrand || 'N/A'}\n`;
        content += `Color: ${report.itemColor || 'N/A'}\n`;
        content += `Identifying Marks: ${report.identifyingMarks || 'N/A'}\n`;
    }
    content += `\nDescription: ${report.description}\n`;
    content += `\nReported By: ${report.reportedBy}\n`;
    return content;
  };

  const handleDownload = () => {
    if (!submittedReport) return;
    const reportText = generateReportText(submittedReport);
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report-${submittedReport.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const resetForm = () => {
    setStep('instructions');
    setAgreed(false);
    setReportType('Lost');
    setCategory('Person');
    setDescription('');
    setLastSeen('');
    setImage(null);
    setImageBase64(null);
    setPersonName('');
    setPersonAge('');
    setPersonGender('');
    setClothingAppearance('');
    setItemName('');
    setItemBrand('');
    setItemColor('');
    setIdentifyingMarks('');
    setSubmittedReport(null);
    setReportToReview(null);
    setAiPrompt('');
  }

  const renderReportSummary = (report: LostFoundReport) => (
       <Card className="text-left bg-gray-50/50">
            <h4 className="font-bold text-lg mb-3 border-b pb-2">{translations.report.reportSummary}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {report.imageUrl && (
                    <div className="md:col-span-1">
                        <img src={report.imageUrl} alt="Uploaded" className="rounded-lg shadow-md w-full object-cover aspect-square" />
                    </div>
                )}
                <div className={`space-y-2 text-sm ${report.imageUrl ? 'md:col-span-2' : 'md:col-span-3'}`}>
                    <p><strong>{translations.myReports.id}:</strong> <span className="font-mono bg-gray-200 px-1 rounded">{report.id}</span></p>
                    <p><strong>{translations.report.type}:</strong> {report.type}</p>
                    <p><strong>{translations.report.category}:</strong> {report.category}</p>
                    {report.personName && <p><strong>{translations.report.personName}:</strong> {report.personName}</p>}
                    {report.personAge && <p><strong>{translations.report.personAge}:</strong> {report.personAge}</p>}
                    {report.personGender && <p><strong>{translations.report.personGender}:</strong> {report.personGender}</p>}
                    {report.clothingAppearance && <p><strong>{translations.report.clothingAppearance}:</strong> {report.clothingAppearance}</p>}
                    {report.itemName && <p><strong>{translations.report.itemName}:</strong> {report.itemName}</p>}
                    {report.itemBrand && <p><strong>{translations.report.itemBrand}:</strong> {report.itemBrand}</p>}
                    {report.itemColor && <p><strong>{translations.report.itemColor}:</strong> {report.itemColor}</p>}
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
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">{translations.report.instructions}</h3>
            <div className="prose text-gray-600">
              <ul>
                <li>Provide as much detail as possible.</li>
                <li>For missing persons, include clothing, age, and height if known.</li>
                <li>For items, describe color, brand, and any identifying marks.</li>
                <li>Do not file false reports. Misuse will result in account suspension.</li>
              </ul>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
              <label htmlFor="agree" className="ml-2 block text-sm text-gray-900">{translations.report.accept}</label>
            </div>
            <Button onClick={() => setStep('form')} disabled={!agreed}>{translations.report.next}</Button>
          </div>
        );
      case 'form':
        return (
         <>
          <form onSubmit={handleReview} className="space-y-6">
            {/* AI Autofill Section */}
            <div>
              <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 mb-1">{translations.report.aiPromptLabel}</label>
              <div className="flex gap-2">
                <textarea 
                    id="ai-prompt"
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    rows={2}
                    placeholder={translations.report.aiPromptPlaceholder}
                    className="flex-grow bg-white text-gray-900 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
                <Button type="button" onClick={handleAutofill} disabled={isAutofilling || !aiPrompt.trim()} className="h-full">
                    {isAutofilling ? <Spinner size="sm" /> : <SparklesIcon />}
                    <span className="hidden sm:inline ml-1">{translations.report.aiFillButton}</span>
                </Button>
              </div>
            </div>

            <hr/>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{translations.report.type}</label>
              <div className="flex gap-4">
                <Button type="button" variant={reportType === 'Lost' ? 'primary' : 'secondary'} onClick={() => setReportType('Lost')}>{translations.report.lost}</Button>
                <Button type="button" variant={reportType === 'Found' ? 'primary' : 'secondary'} onClick={() => setReportType('Found')}>{translations.report.found}</Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{translations.report.category}</label>
              <div className="flex gap-4">
                <Button type="button" variant={category === 'Person' ? 'primary' : 'secondary'} onClick={() => setCategory('Person')}>{translations.report.person}</Button>
                <Button type="button" variant={category === 'Item' ? 'primary' : 'secondary'} onClick={() => setCategory('Item')}>{translations.report.item}</Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{translations.report.upload}</label>
              {imageBase64 ? (
                  <div className="mt-2 relative">
                      <p className="text-center text-xs text-gray-400 mb-1">{translations.reportDetails.imageZoom}</p>
                      <img 
                        src={imageBase64} 
                        alt="Upload preview" 
                        className="w-full h-auto max-h-60 object-contain rounded-md bg-gray-100 p-2 cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => setIsZoomModalOpen(true)}
                      />
                      <Button
                          type="button"
                          variant="danger"
                          className="absolute top-2 right-2 px-2 py-1 text-xs"
                          onClick={() => { setImage(null); setImageBase64(null); (document.getElementById('file-upload') as HTMLInputElement).value = ''; }}
                      >
                          {translations.report.removeImage}
                      </Button>
                       <Button
                          type="button"
                          onClick={handleAnalyzeImage}
                          disabled={isAnalyzing}
                          className="w-full mt-2"
                      >
                          {isAnalyzing ? (
                              <>
                                  <Spinner size="sm" className="mr-2" />
                                  {translations.report.aiAnalyzing}
                              </>
                          ) : (
                              <>
                                  <CameraIcon />
                                  {translations.report.aiAnalyzeButton}
                              </>
                          )}
                      </Button>
                  </div>
              ) : (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          <div className="flex text-sm text-gray-600"><label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"><span>{translations.report.uploadPrompt}</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*"/></label><p className="pl-1">{translations.report.uploadOrDrag}</p></div>
                          <p className="text-xs text-gray-500">{translations.report.uploadHint}</p>
                      </div>
                  </div>
              )}
            </div>
            
            <hr/>
            
            {category === 'Person' && (
              <div className="space-y-4 animate-fade-in-up">
                <div><label htmlFor="personName" className="block text-sm font-medium text-gray-700">{translations.report.personName}</label><input type="text" id="personName" value={personName} onChange={e => setPersonName(e.target.value)} required className="mt-1 block w-full bg-white text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.personNamePlaceholder} /></div>
                <div><label htmlFor="personAge" className="block text-sm font-medium text-gray-700">{translations.report.personAge}</label><input type="text" id="personAge" value={personAge} onChange={e => setPersonAge(e.target.value)} required className="mt-1 block w-full bg-white text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.personAgePlaceholder} /></div>
                <div><label htmlFor="personGender" className="block text-sm font-medium text-gray-700">{translations.report.personGender}</label><select id="personGender" value={personGender} onChange={e => setPersonGender(e.target.value)} required className="mt-1 block w-full bg-white text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"><option value="">{translations.report.selectGender}</option><option value="Male">{translations.report.male}</option><option value="Female">{translations.report.female}</option><option value="Other">{translations.report.other}</option></select></div>
                <div><label htmlFor="clothingAppearance" className="block text-sm font-medium text-gray-700">{translations.report.clothingAppearance}</label><textarea id="clothingAppearance" value={clothingAppearance} onChange={e => setClothingAppearance(e.target.value)} required rows={2} className="mt-1 block w-full bg-white text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.clothingAppearancePlaceholder}></textarea></div>
              </div>
            )}

            {category === 'Item' && (
              <div className="space-y-4 animate-fade-in-up">
                <div><label htmlFor="itemName" className="block text-sm font-medium text-gray-700">{translations.report.itemName}</label><input type="text" id="itemName" value={itemName} onChange={e => setItemName(e.target.value)} required className="mt-1 block w-full bg-white text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.itemNamePlaceholder} /></div>
                <div><label htmlFor="itemBrand" className="block text-sm font-medium text-gray-700">{translations.report.itemBrand}</label><input type="text" id="itemBrand" value={itemBrand} onChange={e => setItemBrand(e.target.value)} className="mt-1 block w-full bg-white text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.itemBrandPlaceholder} /></div>
                <div><label htmlFor="itemColor" className="block text-sm font-medium text-gray-700">{translations.report.itemColor}</label><input type="text" id="itemColor" value={itemColor} onChange={e => setItemColor(e.target.value)} className="mt-1 block w-full bg-white text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.itemColorPlaceholder} /></div>
                <div><label htmlFor="identifyingMarks" className="block text-sm font-medium text-gray-700">{translations.report.identifyingMarks}</label><input type="text" id="identifyingMarks" value={identifyingMarks} onChange={e => setIdentifyingMarks(e.target.value)} className="mt-1 block w-full bg-white text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.identifyingMarksPlaceholder} /></div>
              </div>
            )}
            
            <div><label htmlFor="description" className="block text-sm font-medium text-gray-700">{translations.report.description}</label><textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="mt-1 block w-full bg-white text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.descriptionPlaceholder}></textarea></div>
            <div><label htmlFor="lastSeen" className="block text-sm font-medium text-gray-700">{translations.report.lastSeen}</label><input type="text" id="lastSeen" value={lastSeen} onChange={e => setLastSeen(e.target.value)} required className="mt-1 block w-full bg-white text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" placeholder={translations.report.lastSeenPlaceholder} /></div>
            
            <Button type="submit" className="w-full">{translations.report.reviewButton}</Button>
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
            <div className="space-y-4">
                 <h3 className="text-2xl font-bold text-center">{translations.report.reviewTitle}</h3>
                 <p className="text-center text-gray-600">{translations.report.reviewSubtitle}</p>
                 {renderReportSummary(reportToReview)}
                 <div className="flex gap-4 justify-center pt-4">
                    <Button onClick={() => setStep('form')} variant="secondary">{translations.report.editButton}</Button>
                    <Button onClick={handleSubmit}>{translations.report.confirmSubmitButton}</Button>
                </div>
            </div>
        )
      case 'confirmation':
        if (!submittedReport) return null;
        return (
            <div className="text-center space-y-6 p-4">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{translations.report.confirmationSuccessTitle}</h3>
                <p className="text-gray-600">{translations.report.confirmationSuccessText}</p>
                {renderReportSummary(submittedReport)}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button onClick={handleDownload} variant="secondary">{translations.report.downloadButton}</Button>
                    <Button onClick={resetForm} variant="secondary">{translations.report.newReport}</Button>
                    <Button onClick={() => navigate('/dashboard')}>{translations.report.dashboardButton}</Button>
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