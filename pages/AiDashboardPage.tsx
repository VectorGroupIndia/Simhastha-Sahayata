import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { User, UserRole } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';

// --- ICONS ---
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 2.293-2.293a1 1 0 011.414 0L17 14m-5-5l2.293 2.293a1 1 0 010 1.414L10 17" /></svg>;
const ChipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18a6 6 0 100-12 6 6 0 000 12z" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>;

// --- Helper Components ---
const SettingRow: React.FC<{ id: string; label: string; description: string; checked: boolean; onToggle: (checked: boolean) => void; icon: React.ReactNode; }> = ({ id, label, description, checked, onToggle, icon }) => (
    <div className="flex items-start gap-4 p-4 first:pt-0 last:pb-0">
        <div className="flex-shrink-0 text-orange-500 mt-1">{icon}</div>
        <div className="flex-grow">
            <label htmlFor={id} className="font-medium text-gray-800 dark:text-gray-200">{label}</label>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="flex-shrink-0">
            <ToggleSwitch id={id} checked={checked} onChange={onToggle} />
        </div>
    </div>
);

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-orange-50/50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{value}</p>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
    </div>
);


const AiDashboardPage: React.FC = () => {
    const { user, isAuthenticated, updateUser } = useAuth();
    const { translations } = useLocalization();
    const navigate = useNavigate();

    if (!isAuthenticated || !user || user.role !== UserRole.ADMIN) {
        return <Navigate to="/dashboard" />;
    }
    
    const t = translations.dashboard.admin.aiDashboard;
    const adminSettingsT = translations.profile.adminSettings;

    const handleSystemSettingToggle = (key: keyof NonNullable<User['settings']['systemSettings']>, value: boolean) => {
        const baseSettings = user.settings || { notifications: false, powerButtonSos: false, voiceNav: false };
        updateUser({
            settings: { ...baseSettings, systemSettings: { ...baseSettings.systemSettings, [key]: value } }
        });
    };
    
    const MOCK_AI_LOG = [
        { id: 1, action: t.log.analysis.replace('{id}', 'RPT-1672837198'), time: '2m ago' },
        { id: 2, action: t.log.autofill, time: '5m ago' },
        { id: 3, action: t.log.search.replace('{query}', 'lost red bag'), time: '12m ago' },
        { id: 4, action: t.log.summary.replace('{id}', 'RPT-1672837462'), time: '28m ago' },
        { id: 5, action: t.log.analysis.replace('{id}', 'RPT-1672836598'), time: '45m ago' },
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="max-w-7xl mx-auto space-y-6">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
                    <Button onClick={() => navigate('/dashboard')} variant="secondary"><BackIcon/> Back to Main Dashboard</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                             <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t.controlsTitle}</h2>
                             <div className="divide-y divide-gray-200 dark:divide-gray-700 -m-6">
                                <SettingRow id="ai-autofill" label={adminSettingsT.aiAutofill} description={adminSettingsT.aiAutofillDesc} checked={user.settings?.systemSettings?.aiAutofill ?? true} onToggle={(c) => handleSystemSettingToggle('aiAutofill', c)} icon={<SparklesIcon />} />
                                <SettingRow id="ai-image-analysis" label={adminSettingsT.aiImageAnalysis} description={adminSettingsT.aiImageAnalysisDesc} checked={user.settings?.systemSettings?.aiImageAnalysis ?? true} onToggle={(c) => handleSystemSettingToggle('aiImageAnalysis', c)} icon={<SparklesIcon />} />
                                <SettingRow id="ai-semantic-search" label={t.semanticSearch} description={t.semanticSearchDesc} checked={user.settings?.systemSettings?.aiSemanticSearch ?? true} onToggle={(c) => handleSystemSettingToggle('aiSemanticSearch', c)} icon={<SparklesIcon />} />
                            </div>
                        </Card>
                         <Card>
                             <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t.statusTitle}</h2>
                             <div className="space-y-3">
                                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <div className="flex items-center">
                                        <ChipIcon/>
                                        <p className="font-semibold ml-3">{t.geminiFlash}</p>
                                    </div>
                                    <p className="font-bold text-green-600 dark:text-green-400">{t.operational}</p>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <div className="flex items-center">
                                        <ChipIcon/>
                                        <p className="font-semibold ml-3">{t.geminiVision}</p>
                                    </div>
                                    <p className="font-bold text-green-600 dark:text-green-400">{t.operational}</p>
                                </div>
                             </div>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1 space-y-6">
                         <Card>
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t.metricsTitle}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard title={t.autofills} value={142} />
                                <StatCard title={t.analyses} value={89} />
                                <StatCard title={t.searches} value={210} />
                                <StatCard title="Summaries" value={45} />
                            </div>
                        </Card>
                        <Card>
                            <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900 dark:text-white"><ListIcon/> {t.logTitle}</h2>
                            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                {MOCK_AI_LOG.map(log => (
                                    <div key={log.id} className="flex justify-between items-start bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{log.action}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4">{log.time}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiDashboardPage;
