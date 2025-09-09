
import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useLocalization } from '../../hooks/useLocalization';
import { RegisteredItem } from '../../types';

type ReportSubCategory = 'Bags & Luggage' | 'Electronics' | 'Documents & Cards' | 'Jewelry & Accessories' | 'Other';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (itemData: Omit<RegisteredItem, 'id' | 'status'>, id?: string) => void;
    existingItem: RegisteredItem | null;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onSave, existingItem }) => {
    const { translations } = useLocalization();
    const t = translations.myItems.addModal;
    const reportT = translations.report;

    const [name, setName] = useState('');
    const [subCategory, setSubCategory] = useState<ReportSubCategory>('Bags & Luggage');
    const [brand, setBrand] = useState('');
    const [color, setColor] = useState('');
    const [identifyingMarks, setIdentifyingMarks] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    useEffect(() => {
        if (existingItem) {
            setName(existingItem.name);
            setSubCategory(existingItem.subCategory || 'Bags & Luggage');
            setBrand(existingItem.brand || '');
            setColor(existingItem.color || '');
            setIdentifyingMarks(existingItem.identifyingMarks || '');
            setImages(existingItem.images || []);
        } else {
            // Reset form for new item
            setName('');
            setSubCategory('Bags & Luggage');
            setBrand('');
            setColor('');
            setIdentifyingMarks('');
            setImages([]);
        }
    }, [existingItem, isOpen]);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            Array.from(e.target.files).forEach(handleFile);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
        if (e.dataTransfer.files) {
            Array.from(e.dataTransfer.files).forEach(handleFile);
        }
    }, []);

    const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>, isEntering: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(isEntering);
    };
    
    const removeImage = (indexToRemove: number) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name,
            category: 'Item',
            subCategory,
            brand,
            color,
            identifyingMarks,
            images,
        }, existingItem?.id);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={existingItem ? t.editTitle : t.title}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">{reportT.itemName}</label>
                    <input type="text" id="itemName" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div>
                    <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">{reportT.subCategory}</label>
                    <select id="subCategory" value={subCategory} onChange={e => setSubCategory(e.target.value as ReportSubCategory)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                        <option value="Bags & Luggage">{reportT.subCategories.bags}</option>
                        <option value="Electronics">{reportT.subCategories.electronics}</option>
                        <option value="Documents & Cards">{reportT.subCategories.documents}</option>
                        <option value="Jewelry & Accessories">{reportT.subCategories.jewelry}</option>
                        <option value="Other">{reportT.subCategories.other}</option>
                    </select>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="itemBrand" className="block text-sm font-medium text-gray-700">{reportT.itemBrand}</label>
                        <input type="text" id="itemBrand" value={brand} onChange={e => setBrand(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                    </div>
                     <div>
                        <label htmlFor="itemColor" className="block text-sm font-medium text-gray-700">{reportT.itemColor}</label>
                        <input type="text" id="itemColor" value={color} onChange={e => setColor(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                    </div>
                 </div>
                 <div>
                    <label htmlFor="identifyingMarks" className="block text-sm font-medium text-gray-700">{reportT.identifyingMarks}</label>
                    <textarea id="identifyingMarks" value={identifyingMarks} onChange={e => setIdentifyingMarks(e.target.value)} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t.uploadMultiple}</label>
                    <label
                        onDrop={handleDrop}
                        onDragOver={e => handleDragEvents(e, true)}
                        onDragEnter={e => handleDragEvents(e, true)}
                        onDragLeave={e => handleDragEvents(e, false)}
                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${isDraggingOver ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}
                    >
                         <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <span className="text-sm text-orange-600 font-medium">{reportT.uploadPrompt}</span> {reportT.uploadOrDrag}
                             <input id="file-upload-multi" name="file-upload-multi" type="file" multiple className="sr-only" onChange={handleImageChange} accept="image/*"/>
                         </div>
                    </label>
                    {images.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {images.map((imgSrc, index) => (
                                <div key={index} className="relative group">
                                    <img src={imgSrc} alt={`upload preview ${index+1}`} className="w-full h-20 object-cover rounded-md"/>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    >&times;</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit">{t.save}</Button>
                </div>
            </form>
        </Modal>
    );
};