import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LostFoundReport, UserRole, User } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useLocalization } from '../../hooks/useLocalization';
import { MapModal } from '../ui/MapModal';
import { ImageZoomModal } from '../ui/ImageZoomModal';
import { generateReportPdf } from '../../services/pdfService';
import { getAiReportSummary, getAiResourceSuggestion } from '../../services/geminiService';
import { Spinner } from '../ui/Spinner';

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: LostFoundReport | null;
  onUpdateReport?: (reportId: string, updates: Partial<Pick<LostFoundReport, 'status' | 'assignedToId' | 'assignedToName'>>) => void;
  assignableUsers?: User[];
}

const DetailRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-md text-gray-800">{value}</p>
        </div>
    );
};

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ isOpen, onClose, report, onUpdateReport, assignableUsers = [] }) => {
  const { user } = useAuth();
  const { translations } = useLocalization();
  const [isMapOpen, setMapOpen] = useState(false);
  const [isZoomOpen, setZoomOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<LostFoundReport['status']>('Open');
  const [assignedTo, setAssignedTo] = useState<string>(''); // Stores "id,name"
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);


  useEffect(() => {
    if (report) {
      setNewStatus(report.status);
      setAssignedTo(report.assignedToId ? `${report.assignedToId},${report.assignedToName}` : '');
      setAiSummary(null);
      setIsSummarizing(false);
      setAiSuggestion(null);
      setIsSuggesting(false);
    }
  }, [report]);

  if (!report) return null;

  const handleUpdate = () => {
    if (onUpdateReport) {
      const [idStr, ...nameParts] = assignedTo.split(',');
      const name = nameParts.join(',');
      const id = parseInt(idStr, 10);
      
      onUpdateReport(report.id, {
        status: newStatus,
        assignedToId: assignedTo ? id : undefined,
        assignedToName: assignedTo ? name : undefined,
      });
      onClose();
    }
  };

  const handleGenerateSummary = async () => {
    if (!report) return;
    setIsSummarizing(true);
    setAiSummary(null);
    try {
        const summary = await getAiReportSummary(report);
        setAiSummary(summary);
    } catch (error) {
        console.error("Failed to generate AI summary", error);
        setAiSummary("Failed to generate summary. Please try again.");
    } finally {
        setIsSummarizing(false);
    }
  };
  
  const handleGetSuggestion = async () => {
    if (!report) return;
    setIsSuggesting(true);
    setAiSuggestion(null);
    try {
        const suggestion = await getAiResourceSuggestion(report);
        setAiSuggestion(suggestion);
    } catch (error) {
        console.error("Failed to get AI suggestion", error);
        setAiSuggestion("Failed to generate suggestion. Please try again.");
    } finally {
        setIsSuggesting(false);
    }
  }

  const canUpdate = user && (user.role === UserRole.ADMIN || user.role === UserRole.AUTHORITY || user.role === UserRole.VOLUNTEER);
  const canSuggest = user?.role === UserRole.AUTHORITY && report.priority === 'Critical';


  const getStatusClasses = (status: LostFoundReport['status']) => {
        switch (status) {
            case 'Open': return 'bg-yellow-200 text-yellow-800';
            case 'In Progress': return 'bg-blue-200 text-blue-800';
            case 'Resolved': return 'bg-green-200 text-green-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };
    
  const getPriorityClasses = (priority?: LostFoundReport['priority']) => {
    switch (priority) {
        case 'Critical': return 'bg-red-200 text-red-800';
        case 'High': return 'bg-orange-200 text-orange-800';
        case 'Medium': return 'bg-yellow-200 text-yellow-800';
        case 'Low': return 'bg-blue-200 text-blue-800';
        default: return 'bg-gray-200 text-gray-800';
    }
};

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={translations.reportDetails.title}>
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {report.imageUrl && (
                    <div className="md:col-span-1">
                        <img 
                            src={report.imageUrl} 
                            alt="Report" 
                            className="rounded-lg shadow-md w-full object-cover aspect-square"
                        />
                        <Button onClick={() => setZoomOpen(true)} variant="secondary" className="w-full mt-2">
                            {translations.reportDetails.viewImage}
                        </Button>
                    </div>
                )}
                 <div className={`space-y-3 ${report.imageUrl ? 'md:col-span-2' : 'md:col-span-3'}`}>
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-orange-600">{report.personName || report.itemName}</h3>
                        <div className="text-right flex-shrink-0 ml-2">
                             <span className={`block px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(report.status)}`}>
                                {report.status}
                            </span>
                            {report.priority && (
                                <span className={`block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${getPriorityClasses(report.priority)}`}>
                                    {report.priority} Priority
                                </span>
                            )}
                        </div>
                    </div>
                    <DetailRow label={translations.myReports.id} value={report.id} />
                    <DetailRow label={translations.report.type} value={report.type} />
                    <DetailRow label={translations.report.category} value={report.category} />
                    <DetailRow label={translations.myReports.reportedOn} value={new Date(report.timestamp).toLocaleString()} />
                    <DetailRow label={translations.reportDetails.reportedBy} value={report.reportedBy} />
                    {report.assignedToName && <DetailRow label={translations.reportDetails.assignTo} value={report.assignedToName} />}
                    <hr/>
                    <DetailRow label={translations.report.personAge} value={report.personAge} />
                    <DetailRow label={translations.report.personGender} value={report.personGender} />
                    <DetailRow label={translations.report.clothingAppearance} value={report.clothingAppearance} />
                    <DetailRow label={translations.report.subCategory} value={report.subCategory} />
                    <DetailRow label={translations.report.itemBrand} value={report.itemBrand} />
                    <DetailRow label={translations.report.itemColor} value={report.itemColor} />
                    <DetailRow label={translations.report.itemMaterial.replace(' (optional)', '')} value={report.itemMaterial} />
                    <DetailRow label={translations.report.itemSize.replace(' (optional)', '')} value={report.itemSize} />
                    <DetailRow label={translations.report.identifyingMarks} value={report.identifyingMarks} />
                    <DetailRow label={translations.report.lastSeen} value={report.lastSeen} />
                    <DetailRow label={translations.report.description} value={report.description} />
                 </div>
            </div>

            {aiSuggestion ? (
                <div className="bg-blue-50/50 p-4 rounded-lg mt-4 border border-blue-200 animate-fade-in">
                    <h4 className="font-semibold mb-2 text-blue-700">{translations.dashboard.authorities.aiResourceSuggestion.suggestion}</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiSuggestion}</p>
                </div>
            ) : aiSummary && (
                <div className="bg-orange-50/50 p-4 rounded-lg mt-4 border border-orange-200 animate-fade-in">
                    <h4 className="font-semibold mb-2 text-orange-700">{translations.reportDetails.aiSummaryTitle}</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiSummary}</p>
                </div>
            )}


            {canUpdate && onUpdateReport && (
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold mb-2">{translations.reportDetails.updateStatus}</h4>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <select 
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as LostFoundReport['status'])}
                            className="w-full md:w-auto flex-grow rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                         {user?.role !== UserRole.VOLUNTEER && (
                            <select 
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                                className="w-full md:w-auto flex-grow rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            >
                                <option value="">{translations.reportDetails.unassigned}</option>
                                {assignableUsers.map(u => <option key={u.id} value={`${u.id},${u.name}`}>{u.name} ({u.role})</option>)}
                            </select>
                         )}
                        <Button onClick={handleUpdate} className="w-full md:w-auto">
                            {translations.reportDetails.saveStatus}
                        </Button>
                    </div>
                </div>
            )}
             <div className="mt-6 border-t pt-4 flex flex-wrap justify-end gap-2">
                {canSuggest && !aiSuggestion && (
                    <Button onClick={handleGetSuggestion} variant="secondary" disabled={isSuggesting}>
                        {isSuggesting ? <Spinner size="sm" /> : translations.dashboard.authorities.aiResourceSuggestion.getSuggestion}
                    </Button>
                )}
                {!aiSummary && (
                  <Button onClick={handleGenerateSummary} variant="secondary" disabled={isSummarizing}>
                    {isSummarizing ? <Spinner size="sm" /> : translations.reportDetails.generateSummary }
                  </Button>
                )}
                <Button onClick={() => setMapOpen(true)} variant="secondary" disabled={!report.locationCoords}>
                    {translations.reportDetails.viewOnMap}
                </Button>
                <Button onClick={() => generateReportPdf(report)} variant="secondary">
                    {translations.reportDetails.downloadPdf}
                </Button>
                 <Button onClick={onClose} variant="secondary">
                    {translations.reportDetails.close}
                </Button>
            </div>
        </div>
      </Modal>

      {report.imageUrl && (
        <ImageZoomModal 
            isOpen={isZoomOpen}
            onClose={() => setZoomOpen(false)}
            imageUrl={report.imageUrl}
        />
      )}

      <MapModal 
        isOpen={isMapOpen}
        onClose={() => setMapOpen(false)}
        locationName={report.lastSeen}
        locationCoords={report.locationCoords}
      />
    </>
  );
};

export default ReportDetailsModal;