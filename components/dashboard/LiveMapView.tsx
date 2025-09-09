
import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_FAMILY_MEMBERS, MOCK_POINTS_OF_INTEREST, MOCK_LOST_FOUND_REPORTS } from '../../data/mockData';
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

// --- Helper Components ---
const LayerToggle: React.FC<{ id: string; label: string; checked: boolean; onToggle: (checked: boolean) => void; icon: React.ReactNode; }> = ({ id, label, checked, onToggle, icon }) => (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center">
            <div className="mr-2 text-orange-500">{icon}</div>
            <label htmlFor={id} className="font-medium text-sm text-gray-700">{label}</label>
        </div>
        <ToggleSwitch id={id} checked={checked} onChange={onToggle} />
    </div>
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
        help: true,
        medical: true,
        reports: false,
    });

    const handleLayerToggle = (layer: keyof typeof visibleLayers, isVisible: boolean) => {
        setVisibleLayers(prev => ({ ...prev, [layer]: isVisible }));
    };

    const myReports = useMemo(() =>
        MOCK_LOST_FOUND_REPORTS.filter(report => report.reportedById === user?.id && report.status !== 'Resolved'),
    [user]);

    const Pin = ({ item, color, type }: { item: any, color: string, type: string }) => {
        const coords = type === 'family' ? item.location : item.locationCoords;
        if (!coords) return null;
        const isActive = activePin && activePin.id === item.id && activePin.type === type;

        return (
            <div
                className="absolute cursor-pointer"
                style={{ top: `${coords.lat}%`, left: `${coords.lng}%`, transform: 'translate(-50%, -100%)', zIndex: isActive ? 10 : 1 }}
                onClick={(e) => { e.stopPropagation(); setActivePin({ ...item, type }); }}
            >
                <div className={`relative flex flex-col items-center group`}>
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
             <div className="absolute p-3 bg-white rounded-lg shadow-xl border w-64 animate-fade-in-up" style={{ top: `${coords.lat}%`, left: `${coords.lng}%`, transform: 'translate(-50%, -115%)', zIndex: 20 }}>
                 <button onClick={() => setActivePin(null)} className="absolute -top-2 -right-2 bg-white rounded-full text-gray-600 w-6 h-6 flex items-center justify-center shadow">&times;</button>
                 <h4 className="font-bold text-orange-600 truncate">{item.name || item.itemName || item.personName}</h4>
                 <p className="text-sm text-gray-500">{item.type}</p>
                 <Button onClick={handleNavigateClick} variant="secondary" className="w-full mt-2 text-xs py-1 h-auto flex items-center justify-center"><DirectionsIcon/><span className="ml-1.5">{translations.familyHub.getDirections}</span></Button>
             </div>
        );
    }

    return (
        <Card>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <h3 className="text-xl font-bold mb-4">{t.layers}</h3>
                    <div className="space-y-3">
                        <LayerToggle id="family-layer" label={t.layerFamily} checked={visibleLayers.family} onToggle={(c) => handleLayerToggle('family', c)} icon={<FamilyIcon />} />
                        <LayerToggle id="help-layer" label={t.layerHelp} checked={visibleLayers.help} onToggle={(c) => handleLayerToggle('help', c)} icon={<HelpIcon />} />
                        <LayerToggle id="medical-layer" label={t.layerMedical} checked={visibleLayers.medical} onToggle={(c) => handleLayerToggle('medical', c)} icon={<MedicalIcon />} />
                        <LayerToggle id="reports-layer" label={t.layerReports} checked={visibleLayers.reports} onToggle={(c) => handleLayerToggle('reports', c)} icon={<ReportIcon />} />
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold mb-4">{t.title}</h3>
                    <div className="aspect-video bg-gray-200 rounded-lg relative overflow-hidden" onClick={() => setActivePin(null)}>
                        <img src="https://i.imgur.com/3Z3tV8C.png" alt="Map" className="w-full h-full object-cover" />
                        
                        {visibleLayers.family && MOCK_FAMILY_MEMBERS.map(m => <Pin key={`fam-${m.id}`} item={m} color="purple" type="family"/>)}
                        {visibleLayers.help && MOCK_POINTS_OF_INTEREST.filter(p => p.type !== 'Medical').map(p => <Pin key={`poi-${p.id}`} item={p} color="blue" type={p.type}/>)}
                        {visibleLayers.medical && MOCK_POINTS_OF_INTEREST.filter(p => p.type === 'Medical').map(p => <Pin key={`poi-${p.id}`} item={p} color="green" type={p.type}/>)}
                        {visibleLayers.reports && myReports.map(r => <Pin key={`rpt-${r.id}`} item={r} color="red" type="My Report"/>)}
                        
                        {activePin && <Popover item={activePin} />}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default LiveMapView;
