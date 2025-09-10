

import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_LOST_FOUND_REPORTS, MOCK_SOS_ALERTS, MOCK_OPERATIONAL_ZONES, MOCK_BROADCASTS } from '../../data/mockData';
import { DEMO_USERS } from '../../constants';
import { LostFoundReport, User, UserRole, SosAlert, BroadcastMessage } from '../../types';
import ReportDetailsModal from './ReportDetailsModal';
import { Button } from '../ui/Button';
import { AdvancedBroadcastModal } from './AdvancedBroadcastModal';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';

// --- ICONS ---
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const TasksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const PersonnelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-3-5.197m0 0A7.963 7.963 0 0112 4.354a7.963 7.963 0 013 3.197m-6 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 003-5.197" /></svg>;
const BroadcastIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0M8.464 15.536a5 5 0 010-7.072" /></svg>;
const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
// FIX: Explicitly type the SosAlertIcon component with React.FC to ensure it correctly accepts props like `className` and resolves the 'IntrinsicAttributes' type error.
const SosAlertIcon: React.FC<{ className?: string }> = ({ className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
// FIX: Update MegaphoneIcon to accept a className prop to fix an error where it was being used with a prop it didn't accept.
const MegaphoneIcon: React.FC<{ className?: string }> = ({ className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15v1a1 1 0 001 1h12a1 1 0 001-1v-1a1 1 0 00-.293-.707L16 11.586V8a6 6 0 00-6-6zM8 8a2 2 0 114 0v3a2 2 0 11-4 0V8z" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;


// --- Helper Components ---
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card className="flex items-center p-4">
        <div className="mr-4">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </Card>
);

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

const SidePanel: React.FC<{ reports: LostFoundReport[]; sosAlerts: SosAlert[]; personnel: User[]; user: User | null; onSelectReport: (report: LostFoundReport) => void; translations: any; onOpenBroadcast: () => void; }> = ({ reports, sosAlerts, personnel, user, onSelectReport, translations, onOpenBroadcast }) => {
    const [activeTab, setActiveTab] = useState<'tasks' | 'my-assignments' | 'personnel' | 'broadcasts'>('tasks');
    const t = translations.dashboard.authorities.panel;
    const profileT = translations.profile;
    
    // --- STATE FOR FILTERING ---
    const [taskFilter, setTaskFilter] = useState({ status: 'all', priority: 'all', zone: 'all' });
    const [taskSort, setTaskSort] = useState('date');
    const [personnelRoleFilter, setPersonnelRoleFilter] = useState<UserRole | 'all'>('all');
    const [personnelSearch, setPersonnelSearch] = useState('');

    // --- MEMOIZED DATA ---
    const allTasks = useMemo(() => [
        ...reports.map(r => ({ ...r, kind: 'report' as const })),
        ...sosAlerts.filter(a => a.status !== 'Resolved').map(a => ({ ...a, kind: 'sos' as const, priority: 'Critical' as const })),
    ], [reports, sosAlerts]);
    
    const myAssignments = useMemo(() => reports.filter(r => r.assignedToId === user?.id), [reports, user]);

    const allBroadcasts = useMemo(() => {
        const sosMessages = MOCK_SOS_ALERTS
            .map(a => ({ ...a, kind: 'sos' as const, id: `sos-${a.id}` }));
        
        const generalBroadcasts = MOCK_BROADCASTS
            .map(b => ({ ...b, kind: 'general' as const }));

        return [...sosMessages, ...generalBroadcasts].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, []);
    
    const filteredTasks = useMemo(() => {
        return allTasks
            .filter(task => 
                (taskFilter.status === 'all' || task.status === taskFilter.status) &&
                (taskFilter.priority === 'all' || task.priority === taskFilter.priority) &&
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

    const personnelRoles = useMemo(() => 
        [{ value: 'all', label: 'All Roles' }, ...[...new Set(personnel.map(p => p.role))].map(r => ({value: r, label: r}))]
    , [personnel]);

    const filteredPersonnel = useMemo(() => 
        personnel.filter(p => 
            (personnelRoleFilter === 'all' || p.role === personnelRoleFilter) &&
            (personnelSearch === '' || p.name.toLowerCase().includes(personnelSearch.toLowerCase()))
        )
    , [personnel, personnelRoleFilter, personnelSearch]);

    return (
        <Card className="h-full flex flex-col">
             <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4 overflow-x-auto">
                    <button onClick={() => setActiveTab('tasks')} className={`flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'tasks' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><TasksIcon/> <span className="ml-2">{t.tasks}</span></button>
                    <button onClick={() => setActiveTab('my-assignments')} className={`flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'my-assignments' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><TasksIcon/> <span className="ml-2">{profileT.myAssignments} ({myAssignments.length})</span></button>
                    <button onClick={() => setActiveTab('personnel')} className={`flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'personnel' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><PersonnelIcon/><span className="ml-2">{t.personnel}</span></button>
                    <button onClick={() => setActiveTab('broadcasts')} className={`flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'broadcasts' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><BroadcastIcon/><span className="ml-2">{t.broadcasts}</span></button>
                </nav>
            </div>
             <div className="flex-grow overflow-y-auto mt-4 pr-2">
                {activeTab === 'tasks' && (
                    <div className="animate-fade-in">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4 text-xs">
                            <FilterDropdown label="Status" value={taskFilter.status} onChange={e=>setTaskFilter(f=>({...f, status: e.target.value}))} options={[{value:'all', label: 'All Statuses'}, {value:'Open', label:'Open'}, {value:'In Progress', label:'In Progress'}]}/>
                            <FilterDropdown label="Priority" value={taskFilter.priority} onChange={e=>setTaskFilter(f=>({...f, priority: e.target.value}))} options={[{value:'all', label: 'All Priorities'}, {value:'Critical', label:'Critical'}, {value:'High', label:'High'}, {value:'Medium', label:'Medium'}, {value:'Low', label:'Low'}]}/>
                            <FilterDropdown label="Zone" value={taskFilter.zone} onChange={e=>setTaskFilter(f=>({...f, zone: e.target.value}))} options={[{value:'all', label: 'All Zones'}, ...MOCK_OPERATIONAL_ZONES.map(z=>({value: z.name, label:z.name}))]}/>
                            <FilterDropdown label="Sort by" value={taskSort} onChange={e=>setTaskSort(e.target.value)} options={[{value:'date', label:'Sort by Date'}, {value:'priority', label:'Sort by Priority'}]}/>
                        </div>
                        <div className="space-y-3">
                            {filteredTasks.length > 0 ? filteredTasks.map(task => {
                                const { bg, border } = getPriorityClasses(task.priority);
                                if (task.kind === 'report') {
                                    return (
                                        <div key={`${task.kind}-${task.id}`} className={`p-3 rounded-lg border-l-4 ${bg} ${border}`}>
                                            <p className="font-bold text-sm">
                                                {task.category === 'Person' ? `${t.missingPerson}: ${task.personName}` :
                                                 `${t.report}: ${task.itemName}`}
                                            </p>
                                            <p className="text-xs text-gray-600 italic truncate">"{task.description}"</p>
                                            <div className="text-xs mt-2 flex justify-between items-center">
                                                <p>{new Date(task.timestamp).toLocaleString()}</p>
                                                <Button onClick={()=>onSelectReport(task)} variant="secondary" className="text-xs py-0.5 px-2">{t.viewDetails}</Button>
                                            </div>
                                        </div>
                                    )
                                } else { // task.kind === 'sos'
                                    return (
                                        <div key={`${task.kind}-${task.id}`} className={`p-3 rounded-lg border-l-4 ${bg} ${border}`}>
                                            <p className="font-bold text-sm flex items-center text-red-800">
                                                <SosAlertIcon className="animate-pulse" /> {`${t.sos}: ${task.userName}`}
                                            </p>
                                            <p className="text-xs text-gray-600 italic truncate">"{task.message || 'SOS Activated'}"</p>
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
                 {activeTab === 'my-assignments' && (
                    <div className="animate-fade-in space-y-3">
                         {myAssignments.length > 0 ? myAssignments.map(report => {
                             const { bg, border } = getPriorityClasses(report.priority);
                             return (
                                <div key={report.id} className={`p-3 rounded-lg border-l-4 ${bg} ${border}`}>
                                     <p className="font-bold text-sm">
                                        {report.category === 'Person' ? `${t.missingPerson}: ${report.personName}` :
                                            `${t.report}: ${report.itemName}`}
                                    </p>
                                    <p className="text-xs text-gray-600 italic truncate">"{report.description}"</p>
                                    <div className="text-xs mt-2 flex justify-between items-center">
                                        <p>{new Date(report.timestamp).toLocaleString()}</p>
                                        <Button onClick={() => onSelectReport(report)} variant="secondary" className="text-xs py-0.5 px-2">{t.viewDetails}</Button>
                                    </div>
                                </div>
                            )
                        }) : <p className="text-gray-500 text-center py-8">{profileT.noAssignments}</p>}
                    </div>
                 )}
                 {activeTab === 'personnel' && (
                     <div className="animate-fade-in">
                        <div className="flex flex-col sm:flex-row gap-2 mb-4">
                            <div className="relative flex-grow">
                                <input 
                                    type="text"
                                    placeholder="Search by name..."
                                    value={personnelSearch}
                                    onChange={e => setPersonnelSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                            </div>
                            <select value={personnelRoleFilter} onChange={e => setPersonnelRoleFilter(e.target.value as UserRole | 'all')} className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                                {personnelRoles.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                         {filteredPersonnel.map(p => {
                             const assignment = reports.find(r => r.assignedToId === p.id && r.status === 'In Progress');
                             return (
                                <div key={p.id} className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                                    <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full mr-3" />
                                    <div className="flex-grow">
                                        <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{p.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{p.role}</p>
                                    </div>
                                    <div className="text-xs text-center mx-4">
                                        <p className={`font-semibold ${assignment ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                                            {assignment ? t.statusLabels.onTask : t.statusLabels.available}
                                        </p>
                                        {assignment && <p className="text-gray-500 dark:text-gray-400">{assignment.id}</p>}
                                    </div>
                                    <div className="text-xs text-center">
                                        <p className="font-semibold">Zone</p>
                                        <p className="text-gray-500 dark:text-gray-400">{p.assignedZone?.split(' ')[1] || 'N/A'}</p>
                                    </div>
                                </div>
                             )
                         })}
                         </div>
                     </div>
                )}
                 {activeTab === 'broadcasts' && (
                    <div className="animate-fade-in">
                         <Button onClick={onOpenBroadcast} className="w-full mb-4">{t.broadcastMessage}</Button>
                        <div className="space-y-3">
                            {allBroadcasts.map(log => {
                                const isSos = log.kind === 'sos';
                                return (
                                    <div key={log.id} className={`p-3 rounded-lg border-l-4 ${isSos ? 'bg-red-100 dark:bg-red-900/50 border-red-500' : 'bg-blue-100 dark:bg-blue-900/50 border-blue-500'}`}>
                                        <div className="flex justify-between items-center text-xs mb-2">
                                            <p className={`font-bold flex items-center text-base ${isSos ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'}`}>
                                                {isSos ? <SosAlertIcon className="animate-pulse mr-1" /> : <MegaphoneIcon className="mr-1"/>}
                                                <span className="ml-1">{isSos ? 'SOS ALERT' : 'BROADCAST'}</span>
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                                        </div>
                                        <div className="text-xs mb-2">
                                            <p><span className="font-semibold">{t.broadcastFrom}:</span> {isSos ? log.userName : log.sentBy}</p>
                                            {!isSos && (
                                                <p><span className="font-semibold">{t.to}:</span> {log.recipients.join(', ')}</p>
                                            )}
                                        </div>
                                        <p className="text-sm italic bg-white dark:bg-gray-800/50 p-2 rounded">"{log.message || 'SOS Activated - No Message'}"</p>
                                    </div>
                                )
                            })}
                        </div>
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
    const { addToast } = useToast();
    const { user } = useAuth();
    const t = translations.dashboard.authorities;
    const profileT = translations.profile.authority;

    const [selectedReport, setSelectedReport] = useState<LostFoundReport | null>(null);
    const [isBroadcastModalOpen, setBroadcastModalOpen] = useState(false);

    const staffRoles = new Set([
        UserRole.AUTHORITY,
        UserRole.VOLUNTEER,
    ]);
    const activePersonnel = useMemo(() => DEMO_USERS.filter(u => u.status === 'Active' && staffRoles.has(u.role)), [staffRoles]);
    
    // Calculate stats for the current user
    const myAssignments = useMemo(() => MOCK_LOST_FOUND_REPORTS.filter(r => r.assignedToId === user?.id), [user]);
    const openCases = useMemo(() => myAssignments.filter(r => r.status !== 'Resolved').length, [myAssignments]);
    const resolvedCases = useMemo(() => myAssignments.filter(r => r.status === 'Resolved').length, [myAssignments]);
    const activeSosAlerts = useMemo(() => MOCK_SOS_ALERTS.filter(a => a.status !== 'Resolved').length, []);


    const handleConfirmBroadcast = (message: string, recipients: (UserRole | 'All' | 'Pilgrims' | 'Staff')[]) => {
        if(!user) return;
        const newBroadcast: BroadcastMessage = {
            id: `BC-${Date.now()}`,
            timestamp: new Date().toISOString(),
            message,
            recipients,
            sentBy: user.name,
        };
        MOCK_BROADCASTS.unshift(newBroadcast);
        addToast(t.advancedBroadcast.success, 'success');
    };

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold">{t.title}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title={profileT.openCases} value={openCases} icon={<ClipboardListIcon />} />
                    <StatCard title={profileT.resolvedCases} value={resolvedCases} icon={<CheckCircleIcon />} />
                    <StatCard title={t.kpis.sosAlerts} value={activeSosAlerts} icon={<BellIcon />} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ height: 'calc(80vh - 120px)'}}>
                    <MapView reports={MOCK_LOST_FOUND_REPORTS} sosAlerts={MOCK_SOS_ALERTS} personnel={activePersonnel} onSelectReport={setSelectedReport} translations={translations} />
                    <SidePanel reports={MOCK_LOST_FOUND_REPORTS} sosAlerts={MOCK_SOS_ALERTS} personnel={activePersonnel} user={user} onSelectReport={setSelectedReport} translations={translations} onOpenBroadcast={() => setBroadcastModalOpen(true)}/>
                </div>
            </div>
            <ReportDetailsModal 
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
                report={selectedReport}
                assignableUsers={activePersonnel}
            />
            <AdvancedBroadcastModal
                isOpen={isBroadcastModalOpen}
                onClose={() => setBroadcastModalOpen(false)}
                onConfirm={handleConfirmBroadcast}
            />
        </>
    );
};

export default AuthoritiesDashboard;