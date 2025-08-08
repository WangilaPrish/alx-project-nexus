import { useState } from 'react';
import { HiCheck, HiX } from 'react-icons/hi';
import { useAppliedJobs } from '../context/AppliedJobsContext';
import type { AppliedJob } from '../types';

interface ApplicationStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobTitle: string;
    applicationId?: string;
    currentStatus?: AppliedJob['applicationStatus'];
}

const ApplicationStatusModal = ({
    isOpen,
    onClose,
    jobTitle,
    applicationId,
    currentStatus = 'applied'
}: ApplicationStatusModalProps) => {
    const { updateApplicationStatus } = useAppliedJobs();
    const [selectedStatus, setSelectedStatus] = useState<AppliedJob['applicationStatus']>(currentStatus);
    const [isUpdating, setIsUpdating] = useState(false);

    const statusOptions = [
        { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-800', icon: '📤' },
        { value: 'viewed', label: 'Application Viewed', color: 'bg-yellow-100 text-yellow-800', icon: '👀' },
        { value: 'interviewed', label: 'Interviewed', color: 'bg-purple-100 text-purple-800', icon: '🗣️' },
        { value: 'accepted', label: 'Accepted', color: 'bg-green-100 text-green-800', icon: '🎉' },
        { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800', icon: '❌' },
    ] as const;

    const handleUpdate = async () => {
        if (!applicationId) return;

        try {
            setIsUpdating(true);
            await updateApplicationStatus(applicationId, selectedStatus);
            onClose();
        } catch (error) {
            console.error('Failed to update application status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Update Application Status
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                        Update the status of your application for:
                    </p>
                    <p className="font-medium text-gray-900 mb-4">
                        {jobTitle}
                    </p>

                    <div className="space-y-3">
                        {statusOptions.map((option) => (
                            <label
                                key={option.value}
                                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${selectedStatus === option.value
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="status"
                                    value={option.value}
                                    checked={selectedStatus === option.value}
                                    onChange={() => setSelectedStatus(option.value)}
                                    className="sr-only"
                                />
                                <span className="text-lg mr-3">{option.icon}</span>
                                <span className="flex-1 text-sm font-medium text-gray-900">
                                    {option.label}
                                </span>
                                {selectedStatus === option.value && (
                                    <HiCheck className="w-4 h-4 text-blue-600" />
                                )}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={isUpdating || !applicationId}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isUpdating && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        Update Status
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationStatusModal;
