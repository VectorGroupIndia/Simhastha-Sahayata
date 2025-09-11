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
import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../ui/Card';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_FAMILY_MEMBERS, MOCK_POINTS_OF_INTEREST, MOCK_LOST_FOUND_REPORTS, MOCK_SOS_ALERTS } from '../../data/mockData';
import { MapPointOfInterest, LostFoundReport, Navigatable } from '../../types';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

// --- ICONS ---
const FamilyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.875-5.453L10.27 11.99a3.001 3.001 0 000-3.98l3.755-1.877A3 3 0 0015 8z" /></svg>;
const HelpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
const MedicalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" /></svg>;
const ReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm3 0a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const DirectionsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;
const SosIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const FoodIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm12 5a1 1 0 011 1v9a1 1 0 01-1 1H6a1 1 0 01-1-1V9a1 1 0 011-1h8z" /></svg>;
const RestroomIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.5 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zM6.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8 9a2 2 0 100-4 2 2 0 000 4zm4.5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm1.5 1.5a2 2 0 100-4 2 2 0 000 4zM5 10.5a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1zm8.5-.5a1 1 0 00-1 1v4a1 1 0 102 0v-4a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const LostFoundIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6.364-6.364l-1.414-1.414a2 2 0 010-2.828l1.414-1.414a2 2 0 012.828 0l1.414 1.414a2 2 0 010 2.828l-1.414 1.414a2 2 0 01-2.828 0zm12.728 0l-1.414-1.414a2 2 0 00-2.828 0l-1.414 1.414a2 2 0 000 2.828l1.414 1.414a2 2 0 002.828 0l1.414-1.414a2 2 0 000-2.828z" /></svg>;
const PoliceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;


// --- Helper Components ---
const LayerToggle: React.FC<{ id: string; label: string; checked: boolean; onToggle: (checked: boolean) => void; icon: React.ReactNode; }> = ({ id, label, checked, onToggle, icon }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center">
            <div className="mr-2 text-orange-500">{icon}</div>
            <label htmlFor={id} className="font-medium text-sm text-gray-700">{label}</label>
        </div>
        <ToggleSwitch id={id} checked={checked} onChange={onToggle} />
    </div>
);

const FilterChip: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
            isActive
                ? 'bg-orange-500 text-white shadow'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
    >
        {label}
    </button>
);


interface LiveMapViewProps {
    onNavigate: (destination: Navigatable) => void;
}

const LiveMapView: React.FC<LiveMapViewProps> = ({ onNavigate }) => {
    const { translations } = useLocalization();
    const { user } = useAuth();
    const t = translations.liveMap;
    const [activePin, setActivePin] = useState<any | null>(null);

    const [visibleLayers, setVisibleLayers] = useState({
        family: true,
        sos: true,
        mySosHistory: false,
        helpCenters: true,
        medical: true,
        lostFound: true,
        police: true,
        reports: false,
        food: true,
        restroom: true,
    });
    
    const [statusFilters, setStatusFilters] = useState({
        family: 'all',
        sos: 'all',
        mySosHistory: 'all',
        reports: 'all'
    });

     useEffect(() => {
        const reportIdToFocus = sessionStorage.getItem('focusOnReportId');
        if (reportIdToFocus) {
            const report = MOCK_LOST_FOUND_REPORTS.find(r => r.id === reportIdToFocus);
            if (report && report.locationCoords) {
                setVisibleLayers(prev => ({ ...prev, reports: true }));
                setActivePin({ ...report, type: 'My Report' });
            }
            sessionStorage.removeItem('focusOnReportId');
        }
    }, []);

    const handleLayerToggle = (layer: keyof typeof visibleLayers, isVisible: boolean) => {
        setVisibleLayers(prev => ({ ...prev, [layer]: isVisible }));
    };
    
    const handleFilterChange = (layer: keyof typeof statusFilters, value: string) => {
        setStatusFilters(prev => ({...prev, [layer]: value}));
    }

    const myReports = useMemo(() =>
        MOCK_LOST_FOUND_REPORTS.filter(report => report.reportedById === user?.id && report.status !== 'Resolved'),
    [user]);

    const familyMemberIds = useMemo(() => MOCK_FAMILY_MEMBERS.map(m => m.id), []);
    const familySosAlerts = useMemo(() => MOCK_SOS_ALERTS.filter(alert => alert.userId && familyMemberIds.includes(alert.userId) && alert.status !== 'Resolved'), [familyMemberIds]);
    const userSosHistory = user?.sosHistory || [];


    const Pin = ({ item, color, type, isActive, onClick }: { item: any, color: string, type: string, isActive: boolean, onClick: () => void }) => {
        const coords = (type === 'family') ? item.location : item.locationCoords;
        if (!coords) return null;
        const isSos = type === 'sos';

        return (
            <div
                className="absolute cursor-pointer"
                style={{ top: `${coords.lat}%`, left: `${coords.lng}%`, transform: 'translate(-50%, -100%)', zIndex: isActive ? 10 : 1 }}
                onClick={(e) => { e.stopPropagation(); onClick(); }}
            >
                <div className={`relative flex flex-col items-center group`}>
                    {isSos && <div className={`absolute h-8 w-8 rounded-full bg-red-400 opacity-75 animate-ping`}></div>}
                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 text-${color}-500 drop-shadow-lg transition-transform group-hover:scale-110 ${isActive ? 'scale-125' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div className="bg-white text-xs px-1.5 py-0.5 rounded-full shadow -mt-1 whitespace-nowrap">{item.name || item.itemName || item.personName}</div>
                </div>
            </div>
        );
    };
    
    const Popover = ({ item }: { item: any }) => {
        const coords = item.type === 'family' ? item.location : item.locationCoords;
        if (!coords) return null;

        const handleNavigateClick = () => {
            const destination: Navigatable = {
                name: item.name || item.itemName || item.personName,
                locationCoords: coords
            };
            onNavigate(destination);
            setActivePin(null);
        };
        
        return (
             <div className="absolute p-3 bg-white rounded-lg shadow-xl border w-64 animate-fade-in-up dark:bg-gray-800 dark:border-gray-700" style={{ top: `${coords.lat}%`, left: `${coords.lng}%`, transform: 'translate(-50%, -115%)', zIndex: 20 }} onClick={e => e.stopPropagation()}>
                 <button onClick={() => setActivePin(null)} className="absolute -top-2 -right-2 bg-white dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 w-6 h-6 flex items-center justify-center shadow">&times;</button>
                 <h4 className="font-bold text-orange-600 dark:text-orange-400 truncate">{item.name || item.itemName || item.personName}</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold">{item.type === 'sos' ? "SOS ACTIVATED" : item.type === 'My SOS History' ? `SOS (${item.status})` : item.type}</p>
                 <Button onClick={handleNavigateClick} variant="secondary" className="w-full mt-2 text-xs py-1 h-auto flex items-center justify-center"><DirectionsIcon/><span className="ml-1.5">{translations.familyHub.getDirections}</span></Button>
             </div>
        );
    }
    
    const familyFilterOptions = [{ value: 'all', label: 'All' }, { value: 'Safe', label: t.statuses.safe }, { value: 'Alert', label: t.statuses.alert }, { value: 'Lost', label: t.statuses.lost }];
    const sosFilterOptions = [{ value: 'all', label: 'All' }, { value: 'Broadcasted', label: t.statuses.broadcasted }, { value: 'Responded', label: t.statuses.responded }];
    const mySosHistoryFilterOptions = [...sosFilterOptions, { value: 'Resolved', label: t.statuses.resolved }];
    const reportFilterOptions = [{ value: 'all', label: 'All' }, { value: 'Open', label: t.statuses.open }, { value: 'In Progress', label: t.statuses.inProgress }];

    const poiLayersConfig: Record<MapPointOfInterest['type'], { layer: keyof typeof visibleLayers, color: string }> = {
        'Help Center': { layer: 'helpCenters', color: 'blue' },
        'Lost/Found Center': { layer: 'lostFound', color: 'yellow' },
        'Police Station': { layer: 'police', color: 'red' },
        'Medical': { layer: 'medical', color: 'green' },
        'Food Stall': { layer: 'food', color: 'orange' },
        'Restroom': { layer: 'restroom', color: 'purple' },
    };

    return (
        <Card>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <h3 className="text-xl font-bold mb-4">{t.layers}</h3>
                    <div className="space-y-4">
                        <Card className="p-4">
                            <LayerToggle id="family-layer" label={t.layerFamily} checked={visibleLayers.family} onToggle={(c) => handleLayerToggle('family', c)} icon={<FamilyIcon />} />
                            {visibleLayers.family && (
                                <div className="mt-3 pl-7 flex flex-wrap gap-2 animate-fade-in">
                                    {familyFilterOptions.map(opt => <FilterChip key={opt.value} label={opt.label} isActive={statusFilters.family === opt.value} onClick={() => handleFilterChange('family', opt.value)} />)}
                                </div>
                            )}
                        </Card>
                         <Card className="p-4">
                            <LayerToggle id="sos-layer" label={t.layerSos} checked={visibleLayers.sos} onToggle={(c) => handleLayerToggle('sos', c)} icon={<SosIcon />} />
                            {visibleLayers.sos && (
                                <div className="mt-3 pl-7 flex flex-wrap gap-2 animate-fade-in">
                                    {sosFilterOptions.map(opt => <FilterChip key={opt.value} label={opt.label} isActive={statusFilters.sos === opt.value} onClick={() => handleFilterChange('sos', opt.value)} />)}
                                </div>
                            )}
                        </Card>
                         <Card className="p-4">
                            <LayerToggle id="my-sos-history-layer" label="My SOS History" checked={visibleLayers.mySosHistory} onToggle={(c) => handleLayerToggle('mySosHistory', c)} icon={<SosIcon />} />
                            {visibleLayers.mySosHistory && (
                                <div className="mt-3 pl-7 flex flex-wrap gap-2 animate-fade-in">
                                    {mySosHistoryFilterOptions.map(opt => <FilterChip key={opt.value} label={opt.label} isActive={statusFilters.mySosHistory === opt.value} onClick={() => handleFilterChange('mySosHistory', opt.value)} />)}
                                </div>
                            )}
                        </Card>
                        <Card className="p-4">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Points of Interest</h4>
                            <div className="space-y-3">
                                <LayerToggle id="help-layer" label={t.layerHelpCenters} checked={visibleLayers.helpCenters} onToggle={(c) => handleLayerToggle('helpCenters', c)} icon={<HelpIcon />} />
                                <LayerToggle id="medical-layer" label={t.layerMedical} checked={visibleLayers.medical} onToggle={(c) => handleLayerToggle('medical', c)} icon={<MedicalIcon />} />
                                <LayerToggle id="lost-found-layer" label={t.layerLostFound} checked={visibleLayers.lostFound} onToggle={(c) => handleLayerToggle('lostFound', c)} icon={<LostFoundIcon />} />
                                <LayerToggle id="police-layer" label={t.layerPolice} checked={visibleLayers.police} onToggle={(c) => handleLayerToggle('police', c)} icon={<PoliceIcon />} />
                                <LayerToggle id="food-layer" label={t.layerFood} checked={visibleLayers.food} onToggle={(c) => handleLayerToggle('food', c)} icon={<FoodIcon />} />
                                <LayerToggle id="restroom-layer" label={t.layerRestroom} checked={visibleLayers.restroom} onToggle={(c) => handleLayerToggle('restroom', c)} icon={<RestroomIcon />} />
                            </div>
                        </Card>
                        <Card className="p-4">
                            <LayerToggle id="reports-layer" label={t.layerReports} checked={visibleLayers.reports} onToggle={(c) => handleLayerToggle('reports', c)} icon={<ReportIcon />} />
                            {visibleLayers.reports && (
                                <div className="mt-3 pl-7 flex flex-wrap gap-2 animate-fade-in">
                                    {reportFilterOptions.map(opt => <FilterChip key={opt.value} label={opt.label} isActive={statusFilters.reports === opt.value} onClick={() => handleFilterChange('reports', opt.value)} />)}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold mb-4">{t.title}</h3>
                    <div className="aspect-video bg-gray-200 rounded-lg relative overflow-hidden" onClick={() => setActivePin(null)}>
                        <img src="https://i.imgur.com/3Z3tV8C.png" alt="Map" className="w-full h-full object-cover" />
                        
                        {visibleLayers.family && MOCK_FAMILY_MEMBERS.filter(m => statusFilters.family === 'all' || m.status === statusFilters.family).map(m => <Pin key={`fam-${m.id}`} item={m} color="purple" type="family" isActive={activePin?.id === m.id && activePin?.type === 'family'} onClick={() => setActivePin({ ...m, type: 'family' })}/>)}
                        {visibleLayers.sos && familySosAlerts.filter(a => statusFilters.sos === 'all' || a.status === statusFilters.sos).map(alert => {
                            const member = MOCK_FAMILY_MEMBERS.find(m => m.id === alert.userId);
                            const item = {...alert, name: member?.name || "SOS"};
                            return <Pin key={`sos-${alert.id}`} item={item} color="red" type="sos" isActive={activePin?.id === item.id && activePin?.type === 'sos'} onClick={() => setActivePin({ ...item, type: 'sos' })}/>
                        })}
                        {visibleLayers.mySosHistory && userSosHistory.filter(a => statusFilters.mySosHistory === 'all' || a.status === statusFilters.mySosHistory).map(alert => {
                            const item = {...alert, name: `SOS on ${new Date(alert.timestamp).toLocaleDateString()}`};
                            return <Pin key={`mysos-${alert.id}`} item={item} color="orange" type="My SOS History" isActive={activePin?.id === item.id && activePin?.type === 'My SOS History'} onClick={() => setActivePin({ ...item, type: 'My SOS History' })}/>
                        })}
                        
                        {MOCK_POINTS_OF_INTEREST.map(p => {
                            const config = poiLayersConfig[p.type];
                            if (config && visibleLayers[config.layer as keyof typeof visibleLayers]) {
                                return <Pin key={`poi-${p.id}`} item={p} color={config.color} type={p.type} isActive={activePin?.id === p.id && activePin?.type === p.type} onClick={() => setActivePin({ ...p, type: p.type })}/>
                            }
                            return null;
                        })}

                        {visibleLayers.reports && myReports.filter(r => statusFilters.reports === 'all' || r.status === statusFilters.reports).map(r => <Pin key={`rpt-${r.id}`} item={r} color="yellow" type="My Report" isActive={activePin?.id === r.id && activePin?.type === 'My Report'} onClick={() => setActivePin({ ...r, type: 'My Report' })}/>)}
                        
                        {activePin && <Popover item={activePin} />}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default LiveMapView;