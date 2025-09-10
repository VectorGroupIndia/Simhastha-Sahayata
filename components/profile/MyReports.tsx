/*********************************************************************************
 * Author: Sujit Babar
 * Company: Transfigure Technologies Pvt. Ltd.
 *
 * Copyright Note: All rights reserved.
 * The code, design, process, logic, thinking, and overall layout structure
 * of this application are the intellectual property of Transfigure Technologies Pvt. Ltd.
 * This notice is for informational purposes only and does not grant any rights
 * to copy, modify, or distribute this code without explicit written permission.
 * This code is provided as-is and is intended for read-only inspection. It cannot be edited.
 *********************************************************************************/
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocalization } from '../../hooks/useLocalization';
import { LostFoundReport } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import ReportDetailsModal from '../dashboard/ReportDetailsModal';
import { MOCK_LOST_FOUND_REPORTS } from '../../data/mockData';

export const MyReports: React.FC = () => {
    const { user } = useAuth();
    const { translations } = useLocalization();
    const [selectedReport, setSelectedReport] = useState<LostFoundReport | null>(null);

    if (!user) return null;

    const userReports = MOCK_LOST_FOUND_REPORTS.filter(report => report.reportedById === user.id);
    const t = translations.myReports;

    const getStatusClasses = (status: LostFoundReport['status']) => {
        switch (status) {
            case 'Open': return 'bg-yellow-200 text-yellow-800';
            case 'In Progress': return 'bg-blue-200 text-blue-800';
            case 'AI Search in Progress': return 'bg-indigo-200 text-indigo-800 animate-pulse';
            case 'Located': return 'bg-teal-200 text-teal-800';
            case 'Resolved': return 'bg-green-200 text-green-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };
    
    return (
        <>
            <Card>
                <h3 className="text-2xl font-bold mb-4">{t.title}</h3>
                {userReports.length > 0 ? (
                    <div className="space-y-4">
                        {userReports.map(report => (
                            <div key={report.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div>
                                    <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{report.personName || report.itemName}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.reportedOn}: {new Date(report.timestamp).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-md">{report.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(report.status)}`}>
                                        {t.status[report.status.charAt(0).toLowerCase() + report.status.slice(1).replace(/\s/g, '')] || report.status}
                                    </span>
                                    <Button variant="secondary" onClick={() => setSelectedReport(report)}>{t.viewDetails}</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t.noReports}</p>
                )}
            </Card>
            <ReportDetailsModal 
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
                report={selectedReport}
            />
        </>
    );
};