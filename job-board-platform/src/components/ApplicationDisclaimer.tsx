import { useCallback, useEffect, useState } from 'react';
import { HiCheck, HiInformationCircle, HiX } from 'react-icons/hi';

interface ApplicationDisclaimerProps {
    isVisible: boolean;
    onClose: () => void;
    onUpdateStatus: () => void;
    jobTitle: string;
}

const ApplicationDisclaimer = ({
    isVisible,
    onClose,
    onUpdateStatus,
    jobTitle
}: ApplicationDisclaimerProps) => {
    const [isLeaving, setIsLeaving] = useState(false);

    const handleClose = useCallback(() => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose();
            setIsLeaving(false);
        }, 300);
    }, [onClose]);

    useEffect(() => {
        if (isVisible) {
            // Auto-hide after 8 seconds
            const timer = setTimeout(() => {
                handleClose();
            }, 8000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, handleClose]);

    if (!isVisible) return null;

    return (
        <>
            <style>{`
                @keyframes progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .progress-animation {
                    animation: progress 8s linear forwards;
                }
            `}</style>

            <div
                className={`fixed top-4 right-4 z-50 max-w-sm w-full transition-all duration-300 ${isLeaving
                        ? 'opacity-0 transform translate-x-full'
                        : 'opacity-100 transform translate-x-0'
                    }`}
            >
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 relative overflow-hidden">
                    {/* Progress bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                        <div
                            className={`h-full bg-blue-500 transition-all duration-300 ${isVisible && !isLeaving ? 'progress-animation' : 'w-full'
                                }`}
                            style={{
                                width: isVisible && !isLeaving ? '100%' : '100%'
                            }}
                        />
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <HiCheck className="w-5 h-5 text-green-600" />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                Application Submitted!
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">
                                Your application for <span className="font-medium">{jobTitle}</span> has been submitted.
                            </p>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                <div className="flex items-start gap-2">
                                    <HiInformationCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-xs text-blue-800">
                                        <p className="font-medium mb-1">Remember to track your application!</p>
                                        <p>Come back and update your application status as it progresses.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={onUpdateStatus}
                                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Update Status
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <HiX className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ApplicationDisclaimer;
