import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { User, LostFoundReport } from '../../types';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (taskData: { 
        title: string; 
        description: string; 
        priority: LostFoundReport['priority']; 
        location: string; 
        assignedToId: string; 
    }) => void;
    volunteers: User[];
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onConfirm, volunteers }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<LostFoundReport['priority']>('Medium');
    const [location, setLocation] = useState('');
    const [assignedToId, setAssignedToId] = useState('');

    const handleSubmit = () => {
        if (title.trim() && description.trim() && location.trim() && assignedToId) {
            onConfirm({
                title,
                description,
                priority,
                location,
                assignedToId,
            });
            // Reset form
            setTitle('');
            setDescription('');
            setPriority('Medium');
            setLocation('');
            setAssignedToId('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create and Assign Task">
            <div className="space-y-4">
                <div>
                    <label htmlFor="task-title" className="block text-sm font-medium text-gray-700">Task Title</label>
                    <input
                        type="text"
                        id="task-title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        placeholder="e.g., Investigate crowd at Sector B"
                    />
                </div>
                <div>
                    <label htmlFor="task-desc" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="task-desc"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        placeholder="Provide clear instructions for the volunteer."
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                            id="task-priority"
                            value={priority}
                            onChange={e => setPriority(e.target.value as LostFoundReport['priority'])}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Critical</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="task-location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            id="task-location"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            placeholder="e.g., Near Mahakal Temple, Gate 3"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="task-assign" className="block text-sm font-medium text-gray-700">Assign to Volunteer</label>
                    <select
                        id="task-assign"
                        value={assignedToId}
                        onChange={e => setAssignedToId(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    >
                        <option value="">Select an available volunteer...</option>
                        {volunteers.map(v => (
                            <option key={v.id} value={`${v.id},${v.name}`}>{v.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!title || !description || !location || !assignedToId}>
                        Create & Assign
                    </Button>
                </div>
            </div>
        </Modal>
    );
};