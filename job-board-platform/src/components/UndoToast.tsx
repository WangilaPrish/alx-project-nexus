import { useCallback, useEffect, useState } from 'react';
import { HiCheck, HiX } from 'react-icons/hi';

interface UndoToastProps {
    isVisible: boolean;
    onClose: () => void;
    onUndo: () => void;
    jobTitle: string;
    duration?: number;
}

const UndoToast = ({
    isVisible,
    onClose,
    onUndo,
    jobTitle,
    duration = 6000
}: UndoToastProps) => {
    const [isLeaving, setIsLeaving] = useState(false);
    const [timeLeft, setTimeLeft] = useState(duration / 1000);

    const handleClose = useCallback(() => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose();
        }, 300);
    }, [onClose]);

    const handleUndo = () => {
        onUndo();
        handleClose();
    };

    useEffect(() => {
        if (!isVisible) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isVisible, handleClose]);

    if (!isVisible) return null;

    return (
        <>
            <style>{`
                @keyframes countdown {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .countdown-bar {
                    animation: countdown ${duration}ms linear;
                }
            `}</style>

            <div
                className={`fixed bottom-4 right-4 z-50 max-w-sm w-full transition-all duration-300 ${isLeaving
                    ? 'opacity-0 transform translate-y-full'
                    : 'opacity-100 transform translate-y-0'
                    }`}
            >
                <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4 relative overflow-hidden">
                    {/* Progress bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-600">
                        <div className="h-full bg-yellow-400 countdown-bar" />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                <HiCheck className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">Application Removed</h4>
                            <p className="text-xs text-gray-300 mt-1">
                                {jobTitle} - {Math.ceil(timeLeft)}s to undo
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleUndo}
                                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                            >
                                <HiReply className="w-3 h-3" />
                                Undo
                            </button>

                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <HiX className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UndoToast;
