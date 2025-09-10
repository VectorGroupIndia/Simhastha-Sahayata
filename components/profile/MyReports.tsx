
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocalization } from '../../hooks/useLocalization';
import { LostFoundReport } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import ReportDetailsModal from '../dashboard/ReportDetailsModal';
import { MOCK_LOST_FOUND_REPORTS } from '../../data/mockData';

export const MyReports: React.FC<{ onSelectReport: (report: LostFoundReport) => void }> = ({ onSelectReport }) => {
    const { user } = useAuth();
    const { translations } = useLocalization();
    const [selectedReport, setSelectedReport] = useState<LostFoundReport | null>(null);

    if (!user) return null;

    const userReports = MOCK_LOST_FOUND_REPORTS.filter(report => report.reportedById === user.id);

    const getStatusClasses = (status: LostFoundReport['status']) => {
        switch (status) {
            case 'Open': return 'bg-yellow-200 text-yellow-800';
            case 'In Progress': return 'bg-blue-200 text-blue-800';
            case 'Resolved': return 'bg-green-200 text-green-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };
    
    return (
        <>
            <Card>
                <h3 className="text-2xl font-bold mb-4">{translations.myReports.title}</h3>
                {userReports.length > 0 ? (
                    <div className="space-y-4">
                        {userReports.map(report => (
                            <div key={report.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div>
                                    <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{report.personName || report.itemName}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{translations.myReports.reportedOn}: {new Date(report.timestamp).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-md">{report.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(report.status)}`}>
                                        {report.status}
                                    </span>
                                    <Button variant="secondary" onClick={() => setSelectedReport(report)}>{translations.myReports.viewDetails}</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">{translations.myReports.noReports}</p>
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
