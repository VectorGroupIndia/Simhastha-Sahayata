import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_LOST_FOUND_REPORTS } from '../../data/mockData';
import { ImageZoomModal } from '../ui/ImageZoomModal';
import { LostFoundReport } from '../../types';

/**
 * Volunteer Dashboard Component.
 * This view is tailored for on-the-ground volunteers. It presents a clear, actionable
 * list of tasks, such as responding to SOS alerts or assisting with missing person reports
 * in their vicinity.
 */
const VolunteerDashboard: React.FC = () => {
    const { translations } = useLocalization();
    const activeAlerts = MOCK_LOST_FOUND_REPORTS.filter(r => r.category === 'Person' && r.status === 'Open');

    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
    const [zoomedImageUrl, setZoomedImageUrl] = useState('');

    const openZoomModal = (report: LostFoundReport) => {
        if(report.imageUrl) {
            setZoomedImageUrl(report.imageUrl);
            setIsZoomModalOpen(true);
        }
    }

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold">{translations.dashboard.volunteer.title}</h2>
                <Card>
                    <h3 className="text-xl font-bold mb-4">{translations.dashboard.volunteer.activeAlerts}</h3>
                    {activeAlerts.length > 0 ? (
                        <div className="space-y-4">
                            {activeAlerts.map(alert => (
                                <div key={alert.id} className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center">
                                        {alert.imageUrl && (
                                            <img 
                                                src={alert.imageUrl} 
                                                alt="Alert" 
                                                className="w-12 h-12 rounded-full mr-4 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => openZoomModal(alert)}
                                                title={translations.reportDetails.imageZoom}
                                            />
                                        )}
                                        <div>
                                            <p className="font-semibold">{alert.description}</p>
                                            <p className="text-sm text-gray-600">Near: {alert.lastSeen}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 self-end md:self-center">
                                        <button className="text-sm bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">Accept</button>
                                        <button className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">{translations.dashboard.volunteer.noAlerts}</p>
                    )}
                </Card>
            </div>
             <ImageZoomModal 
                isOpen={isZoomModalOpen}
                onClose={() => setIsZoomModalOpen(false)}
                imageUrl={zoomedImageUrl}
            />
        </>
    );
};

export default VolunteerDashboard;