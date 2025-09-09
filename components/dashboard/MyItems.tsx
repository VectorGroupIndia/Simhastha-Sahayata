
import React, { useState, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useLocalization } from '../../hooks/useLocalization';
import { useToast } from '../../hooks/useToast';
import { RegisteredItem, LostFoundReport } from '../../types';
import { AddItemModal } from './AddItemModal';
import { MarkAsLostModal } from './MarkAsLostModal';
import { MOCK_LOST_FOUND_REPORTS } from '../../data/mockData';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

const MyItems: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { translations } = useLocalization();
    const { addToast } = useToast();
    const t = translations.myItems;

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isMarkAsLostModalOpen, setMarkAsLostModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<RegisteredItem | null>(null);
    const [itemToMarkLost, setItemToMarkLost] = useState<RegisteredItem | null>(null);

    const items = user?.registeredItems || [];

    const handleOpenAddModal = (item?: RegisteredItem) => {
        setItemToEdit(item || null);
        setAddModalOpen(true);
    };

    const handleSaveItem = (itemData: Omit<RegisteredItem, 'id' | 'status'>, id?: string) => {
        let updatedItems: RegisteredItem[];
        if (id) { // Editing existing item
            // FIX: Replaced implicit spread with explicit object creation to resolve a subtle type inference issue.
            // When using nested spreads, TypeScript sometimes widens literal union types (like 'Safe' | 'Lost') to a generic string.
            // By reconstructing the object, we ensure the 'status' property retains its specific type from the original 'item'.
            updatedItems = items.map(item => {
                if (item.id === id) {
                    return {
                        ...itemData,
                        id: item.id,
                        status: item.status,
                    };
                }
                return item;
            });
            addToast(t.addModal.updateSuccess, 'success');
        } else { // Adding new item
            const newItem: RegisteredItem = {
                ...itemData,
                id: `item-${Date.now()}`,
                status: 'Safe'
            };
            updatedItems = [...items, newItem];
            addToast(t.addModal.success, 'success');
        }
        updateUser({ registeredItems: updatedItems });
        setAddModalOpen(false);
        setItemToEdit(null);
    };

    const handleOpenMarkAsLostModal = (item: RegisteredItem) => {
        setItemToMarkLost(item);
        setMarkAsLostModalOpen(true);
    };

    const handleConfirmMarkAsLost = (lastSeen: string, description: string) => {
        if (!itemToMarkLost || !user) return;
        
        // 1. Create a new LostFoundReport
        const newReport: LostFoundReport = {
            id: `RPT-${Date.now()}`,
            type: 'Lost',
            category: 'Item',
            subCategory: itemToMarkLost.subCategory,
            description: `${itemToMarkLost.name}. ${description}`,
            lastSeen: lastSeen,
            imageUrl: itemToMarkLost.images[0] || undefined,
            imageUrls: itemToMarkLost.images,
            reportedBy: user.name,
            reportedById: user.id,
            timestamp: new Date().toISOString(),
            status: 'Open',
            originalItemId: itemToMarkLost.id,
            itemName: itemToMarkLost.name,
            itemBrand: itemToMarkLost.brand,
            itemColor: itemToMarkLost.color,
            identifyingMarks: itemToMarkLost.identifyingMarks,
        };
        MOCK_LOST_FOUND_REPORTS.unshift(newReport);

        // 2. Update the status of the registered item
        // FIX: Cast 'Lost' to its literal type to prevent TypeScript from widening it to a generic 'string'.
        // This ensures the updated item correctly matches the 'RegisteredItem' type.
        const updatedItems = items.map(item =>
            item.id === itemToMarkLost.id ? { ...item, status: 'Lost' as 'Lost' } : item
        );
        updateUser({ registeredItems: updatedItems });
        
        addToast(t.markAsLostModal.success, 'success');
        setMarkAsLostModalOpen(false);
        setItemToMarkLost(null);
    };

    const getStatusClasses = (status: RegisteredItem['status']) => {
        return status === 'Safe' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    return (
        <>
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">{t.title}</h3>
                    <Button onClick={() => handleOpenAddModal()}>
                        <PlusIcon /> {t.addItem}
                    </Button>
                </div>

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map(item => (
                            <div key={item.id} className="bg-white rounded-lg shadow-lg border flex flex-col">
                                <img
                                    src={item.images[0] || 'https://via.placeholder.com/400'}
                                    alt={item.name}
                                    className="w-full h-48 object-cover rounded-t-lg"
                                />
                                <div className="p-4 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-lg text-gray-800">{item.name}</h4>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(item.status)}`}>
                                            {t[item.status.toLowerCase() as keyof typeof t]}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{item.subCategory}</p>
                                    <p className="text-sm text-gray-600 flex-grow">{item.identifyingMarks}</p>
                                    <div className="mt-4 pt-4 border-t flex gap-2">
                                        <Button onClick={() => handleOpenAddModal(item)} variant="secondary" className="flex-1 text-sm">
                                            {t.viewDetails}
                                        </Button>
                                        <Button
                                            onClick={() => handleOpenMarkAsLostModal(item)}
                                            variant="danger"
                                            className="flex-1 text-sm"
                                            disabled={item.status === 'Lost'}
                                        >
                                            {item.status === 'Lost' ? t.itemLost : t.markAsLost}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-gray-500">{t.noItems}</p>
                    </div>
                )}
            </Card>

            <AddItemModal
                isOpen={isAddModalOpen}
                onClose={() => { setAddModalOpen(false); setItemToEdit(null); }}
                onSave={handleSaveItem}
                existingItem={itemToEdit}
            />

            <MarkAsLostModal
                isOpen={isMarkAsLostModalOpen}
                onClose={() => setMarkAsLostModalOpen(false)}
                onConfirm={handleConfirmMarkAsLost}
                item={itemToMarkLost}
            />
        </>
    );
};

export default MyItems;