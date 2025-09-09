
import React from 'react';
import { Card } from '../ui/Card';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_LOST_FOUND_REPORTS } from '../../data/mockData';

/**
 * Authorities Dashboard Component.
 * This dashboard is designed for security and management personnel. It focuses on
 * high-priority information like crowd density, active SOS alerts, and reports of
 * missing persons, enabling quick and informed responses.
 */
const AuthoritiesDashboard: React.FC = () => {
    const { translations } = useLocalization();
    const missingPersonReports = MOCK_LOST_FOUND_REPORTS.filter(r => r.category === 'Person' && r.type === 'Lost');
    
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">{translations.dashboard.authorities.title}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-xl font-bold mb-4">{translations.dashboard.authorities.crowdDensity}</h3>
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <img src="https://i.imgur.com/eBf2gT4.png" alt="Crowd Density Heatmap" className="w-full h-full object-cover rounded-lg" />
                    </div>
                </Card>
                 <Card>
                    <h3 className="text-xl font-bold mb-4">{translations.dashboard.authorities.missingPersons}</h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {missingPersonReports.map(report => (
                             <div key={report.id} className="flex items-start bg-red-50 p-3 rounded-lg border border-red-200">
                                {report.imageUrl && <img src={report.imageUrl} alt="Missing Person" className="w-16 h-16 rounded-md mr-4 object-cover" />}
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800">{report.description}</p>
                                    <p className="text-sm text-gray-600">Last seen: {report.lastSeen}</p>
                                    <p className="text-sm text-gray-600">Reported by: {report.reportedBy}</p>
                                </div>
                                <button className="ml-4 text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Respond</button>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AuthoritiesDashboard;
