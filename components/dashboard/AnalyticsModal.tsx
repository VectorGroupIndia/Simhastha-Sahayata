import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_ANALYTICS_DATA } from '../../data/mockData';

interface AnalyticsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChartCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
        {children}
    </div>
);

const BarChart: React.FC<{ data: { label: string, value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    const colors = ['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500'];
    return (
        <div className="space-y-2">
            {data.map((item, index) => (
                <div key={item.label} className="flex items-center">
                    <div className="w-24 text-sm text-gray-600 truncate">{item.label}</div>
                    <div className="flex-grow bg-gray-200 rounded-full h-6">
                        <div
                            className={`h-6 rounded-full text-white text-xs flex items-center justify-end pr-2 ${colors[index % colors.length]}`}
                            style={{ width: `${(item.value / maxValue) * 100}%` }}
                        >
                            {item.value}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const LineChart: React.FC<{ data: { label: string, value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    return (
        <div className="h-48 bg-gray-50 p-2 rounded-lg flex items-end justify-around">
            {data.map(item => (
                <div key={item.label} className="flex flex-col items-center h-full justify-end group">
                    <div className="text-xs text-white bg-gray-700 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity -mt-6">
                        {item.value}
                    </div>
                    <div
                        className="w-4 bg-orange-500 hover:bg-orange-600 rounded-t-sm transition-colors"
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                    />
                    <div className="text-xs mt-1 text-gray-500">{item.label}</div>
                </div>
            ))}
        </div>
    );
};

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
    const { translations } = useLocalization();
    const t = translations.dashboard.authorities.analyticsModal;

    const data = MOCK_ANALYTICS_DATA;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t.title}>
            <div className="space-y-6">
                <ChartCard title={t.reportsOverTime}>
                    <LineChart data={data.reportsOverTime.map(d => ({ label: d.hour, value: d.count }))} />
                </ChartCard>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartCard title={t.reportsByCategory}>
                        <BarChart data={data.reportsByCategory.map(d => ({ label: d.category, value: d.count }))} />
                    </ChartCard>
                    <ChartCard title={t.reportsByZone}>
                         <BarChart data={data.reportsByZone.map(d => ({ label: d.zone, value: d.count }))} />
                    </ChartCard>
                </div>
                <div className="text-right pt-4">
                    <Button onClick={onClose} variant="secondary">{t.close}</Button>
                </div>
            </div>
        </Modal>
    );
};