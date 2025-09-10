import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_LOST_FOUND_REPORTS, MOCK_SOS_ALERTS, MOCK_OPERATIONAL_ZONES } from '../../data/mockData';
import { DEMO_USERS } from '../../constants';
import { LostFoundReport, User, UserRole, SosAlert } from '../../types';
import ReportDetailsModal from './ReportDetailsModal';
import { Button } from '../ui/Button';

// --- ICONS ---
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const TasksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const PersonnelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-3-5.197m0 0A7.963 7.963 0 0112 4.354a7.963 7.963 0 013 3.197m-6 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 003-5.197" /></svg>;
const BroadcastIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0M8.464 15.536a5 5 0 010-7.072" /></svg>;

// --- Helper Components ---
const FilterDropdown: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: {value: string, label: string}[]}> = ({label, value, onChange, options}) => (
    <div>
        <label htmlFor={label} className="sr-only">{label}</label>
        <select id={label} value={value} onChange={onChange} className="w-full text-xs rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 py-1.5 pl-2 pr-8">
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

const getPriorityClasses = (priority?: 'Low' | 'Medium' | 'High' | 'Critical') => {
    switch (priority) {
        case 'Critical': return { text: 'text-red-500', bg: 'bg-red-100', border: 'border-red-500' };
        case 'High': return { text: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-500' };
        case 'Medium': return { text: 'text-yellow-500', bg: 'bg-yellow-100', border: 'border-yellow-500' };
        case 'Low': return { text: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-500' };
        default: return { text: 'text-gray-500', bg: 'bg-gray-100', border: 'border-gray-500' };
    }
};

const MapView: React.FC<{ reports: LostFoundReport[]; sosAlerts: SosAlert[]; personnel: User[]; onSelectReport: (report: LostFoundReport) => void; translations: any; }> = ({ reports, sosAlerts, personnel, onSelectReport, translations }) => {
    const t = translations.dashboard.authorities.map;

    const Pin: React.FC<{ item: any; type: 'report' | 'sos' | 'personnel' }> = ({ item, type }) => {
        const coords = item.locationCoords;
        if (!coords) return null;

        const pinStyles = {
            report: { color: getPriorityClasses(item.priority).text, label: item.personName || item.itemName },
            sos: { color: 'text-red-500 animate-ping', label: t.sos },
            personnel: { color: 'text-green-500', label: item.name?.split(' ')[0] || t.personnel },
        };
        const style = pinStyles[type];

        return (
            <div
                className="absolute"
                style={{ top: `${coords.lat}%`, left: `${coords.lng}%`, transform: 'translate(-50%, -100%)' }}
                onClick={() => type === 'report' && onSelectReport(item)}
            >
                <div className={`relative flex flex-col items-center ${type === 'report' ? 'cursor-pointer group' : ''}`}>
                    {type === 'sos' && <div className={`absolute h-8 w-8 rounded-full bg-red-400 opacity-75 ${style.color}`}></div>}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 drop-shadow-lg transition-transform ${type === 'report' ? 'group-hover:scale-110' : ''} ${style.color}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div className="bg-white text-xs px-1.5 py-0.5 rounded-full shadow -mt-1 whitespace-nowrap">{style.label}</div>
                </div>
            </div>
        );
    };

    return (
        <Card className="h-full flex flex-col">
            <h3 className="text-xl font-bold mb-4 flex items-center"><MapIcon/> <span className="ml-2">{t.title}</span></h3>
            <div className="flex-grow aspect-video bg-gray-200 rounded-lg relative overflow-hidden">
                <img src="https://i.imgur.com/3Z3tV8C.png" alt="Map" className="w-full h-full object-cover" />
                
                {/* Zones Layer */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {MOCK_OPERATIONAL_ZONES.map(zone => (
                        <path key={zone.id} d={zone.path} fill={zone.color} fillOpacity="0.2" stroke={zone.color} strokeWidth="0.2" strokeOpacity="0.6" />
                    ))}
                </svg>
                <div className="absolute top-2 left-2 bg-white/80 p-2 rounded shadow">
                    <h4 className="font-bold text-xs mb-1">{t.operationalZones}</h4>
                    {MOCK_OPERATIONAL_ZONES.map(zone => <div key={zone.id} className="flex items-center text-xs"><div className="w-3 h-3 rounded-full mr-1.5" style={{backgroundColor: zone.color}}></div> {zone.name}</div>)}
                </div>

                {reports.map(r => <Pin key={`rpt-${r.id}`} item={r} type="report" />)}
                {sosAlerts.map(a => <Pin key={`sos-${a.id}`} item={a} type="sos" />)}
                {personnel.map((p) => <Pin key={`per-${p.id}`} item={p} type="personnel" />)}
            </div>
        </Card>
    );
};

const SidePanel: React.FC<{ reports: LostFoundReport[]; sosAlerts: SosAlert[]; personnel: User[]; onSelectReport: (report: LostFoundReport) => void; translations: any; }> = ({ reports, sosAlerts, personnel, onSelectReport, translations }) => {
    const [activeTab, setActiveTab] = useState<'tasks' | 'personnel' | 'broadcasts'>('tasks');
    const t = translations.dashboard.authorities.panel;
    
    // Task Panel State
    const [taskFilter, setTaskFilter] = useState({ status: 'all', priority: 'all', zone: 'all' });
    const [taskSort, setTaskSort] = useState('date');
    const allTasks = useMemo(() => [
        ...reports.map(r => ({ ...r, kind: 'report' as const })),
        ...sosAlerts.filter(a => a.status !== 'Resolved').map(a => ({ ...a, kind: 'sos' as const, priority: 'Critical' as const })),
    ], [reports, sosAlerts]);
    
    const filteredTasks = useMemo(() => {
        return allTasks
            .filter(task => 
                (taskFilter.status === 'all' || task.status === taskFilter.status) &&
                (taskFilter.priority === 'all' || task.priority === taskFilter.priority) &&
                // FIX: Check task.kind to ensure task is a LostFoundReport before accessing assignedToId.
                (taskFilter.zone === 'all' || (task.kind === 'report' && task.assignedToId && personnel.find(p=>p.id === task.assignedToId)?.assignedZone === taskFilter.zone))
            )
            .sort((a, b) => {
                if(taskSort === 'priority') {
                    const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                    return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
                }
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            });
    }, [allTasks, taskFilter, taskSort, personnel]);

    return (
        <Card className="h-full flex flex-col">
             <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4">
                    <button onClick={() => setActiveTab('tasks')} className={`flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'tasks' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><TasksIcon/> <span className="ml-2">{t.tasks}</span></button>
                    <button onClick={() => setActiveTab('personnel')} className={`flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'personnel' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><PersonnelIcon/><span className="ml-2">{t.personnel}</span></button>
                    <button onClick={() => setActiveTab('broadcasts')} className={`flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'broadcasts' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><BroadcastIcon/><span className="ml-2">{t.broadcasts}</span></button>
                </nav>
            </div>
             <div className="flex-grow overflow-y-auto mt-4 pr-2">
                {activeTab === 'tasks' && (
                    <div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4 text-xs">
                            <FilterDropdown label="Status" value={taskFilter.status} onChange={e=>setTaskFilter(f=>({...f, status: e.target.value}))} options={[{value:'all', label: 'All Statuses'}, {value:'Open', label:'Open'}, {value:'In Progress', label:'In Progress'}]}/>
                            <FilterDropdown label="Priority" value={taskFilter.priority} onChange={e=>setTaskFilter(f=>({...f, priority: e.target.value}))} options={[{value:'all', label: 'All Priorities'}, {value:'Critical', label:'Critical'}, {value:'High', label:'High'}, {value:'Medium', label:'Medium'}, {value:'Low', label:'Low'}]}/>
                            <FilterDropdown label="Zone" value={taskFilter.zone} onChange={e=>setTaskFilter(f=>({...f, zone: e.target.value}))} options={[{value:'all', label: 'All Zones'}, ...MOCK_OPERATIONAL_ZONES.map(z=>({value: z.name, label:z.name}))]}/>
                            <FilterDropdown label="Sort by" value={taskSort} onChange={e=>setTaskSort(e.target.value)} options={[{value:'date', label:'Sort by Date'}, {value:'priority', label:'Sort by Priority'}]}/>
                        </div>
                        <div className="space-y-3">
                            {/* FIX: Use a discriminated union (if/else on task.kind) to help TypeScript narrow the type of `task` and fix property access errors. */}
                            {filteredTasks.length > 0 ? filteredTasks.map(task => {
                                const { bg, border } = getPriorityClasses(task.priority);
                                if (task.kind === 'report') {
                                    return (
                                        <div key={`${task.kind}-${task.id}`} className={`p-3 rounded-lg border-l-4 ${bg} ${border}`}>
                                            <p className="font-bold text-sm">
                                                {task.category === 'Person' ? `${t.missingPerson}: ${task.personName}` :
                                                 `${t.report}: ${task.itemName}`}
                                            </p>
                                            <p className="text-xs text-gray-600 italic">"{task.description}"</p>
                                            <div className="text-xs mt-2 flex justify-between items-center">
                                                <p>{new Date(task.timestamp).toLocaleString()}</p>
                                                <Button onClick={()=>onSelectReport(task)} variant="secondary" className="text-xs py-0.5 px-2">{t.viewDetails}</Button>
                                            </div>
                                        </div>
                                    )
                                } else { // task.kind === 'sos'
                                    return (
                                        <div key={`${task.kind}-${task.id}`} className={`p-3 rounded-lg border-l-4 ${bg} ${border}`}>
                                            <p className="font-bold text-sm">
                                                {`${t.sos}: ${task.userName}`}
                                            </p>
                                            <p className="text-xs text-gray-600 italic">"{task.message}"</p>
                                            <div className="text-xs mt-2 flex justify-between items-center">
                                                <p>{new Date(task.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )
                                }
                            }) : <p className="text-gray-500 text-center py-8">{t.noTasks}</p>}
                        </div>
                    </div>
                )}
                 {activeTab === 'personnel' && (
                     <div className="space-y-2">
                         {personnel.map(p => {
                             const assignment = reports.find(r => r.assignedToId === p.id && r.status === 'In Progress');
                             return (
                                <div key={p.id} className="flex items-center bg-gray-50 p-2 rounded-lg">
                                    <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full mr-3" />
                                    <div className="flex-grow">
                                        <p className="font-medium text-sm text-gray-800">{p.name}</p>
                                        <p className={`text-xs ${assignment ? 'text-blue-600' : 'text-green-600'}`}>
                                            {assignment ? `${t.statusLabels.onTask}: ${assignment.id}` : t.statusLabels.available}
                                        </p>
                                    </div>
                                    <div className="text-xs text-center">
                                        <p className="font-semibold">Zone</p>
                                        <p>{p.assignedZone?.split(' ')[1]}</p>
                                    </div>
                                </div>
                             )
                         })}
                     </div>
                )}
                 {activeTab === 'broadcasts' && (
                    <div className="space-y-3">
                        {MOCK_SOS_ALERTS.filter(a => a.message).map(alert => (
                             <div key={`log-${alert.id}`} className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-semibold text-sm">{t.broadcastFrom}: {alert.userName}</p>
                                <p className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</p>
                                <p className="text-sm italic mt-1 bg-white p-2 rounded">"{alert.message}"</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    )
}

/**
 * Authorities Dashboard Component - Redesigned Command Center.
 */
const AuthoritiesDashboard: React.FC = () => {
    const { translations } = useLocalization();
    const t = translations.dashboard.authorities;
    const [selectedReport, setSelectedReport] = useState<LostFoundReport | null>(null);

    const activePersonnel = useMemo(() => DEMO_USERS.filter(u => u.status === 'Active' && (u.role === UserRole.AUTHORITY || u.role === UserRole.VOLUNTEER)), []);

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold">{t.title}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[80vh]">
                    <MapView reports={MOCK_LOST_FOUND_REPORTS} sosAlerts={MOCK_SOS_ALERTS} personnel={activePersonnel} onSelectReport={setSelectedReport} translations={translations} />
                    <SidePanel reports={MOCK_LOST_FOUND_REPORTS} sosAlerts={MOCK_SOS_ALERTS} personnel={activePersonnel} onSelectReport={setSelectedReport} translations={translations}/>
                </div>
            </div>
            <ReportDetailsModal 
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
                report={selectedReport}
                assignableUsers={activePersonnel}
            />
        </>
    );
};

export default AuthoritiesDashboard;