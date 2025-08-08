import { useCallback, useEffect, useState } from 'react';
import { HiCheck, HiExclamation, HiInformationCircle, HiX } from 'react-icons/hi';

export interface ToastProps {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    onClose: (id: string) => void;
}

const Toast = ({ id, type, title, message, duration = 4000, onClose }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    const handleClose = useCallback(() => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose(id);
        }, 300);
    }, [id, onClose]);

    useEffect(() => {
        // Animate in
        setTimeout(() => setIsVisible(true), 10);

        // Auto close
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, handleClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <HiCheck className="w-5 h-5" />;
            case 'error':
                return <HiX className="w-5 h-5" />;
            case 'warning':
                return <HiExclamation className="w-5 h-5" />;
            case 'info':
                return <HiInformationCircle className="w-5 h-5" />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-white';
            case 'info':
                return 'bg-blue-500 text-white';
        }
    };

    return (
        <>
            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .toast-progress {
                    animation: shrink ${duration}ms linear;
                }
            `}</style>

            <div
                className={`transform transition-all duration-300 ${isVisible && !isLeaving
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-full opacity-0'
                    }`}
            >
                <div className={`${getColors()} px-6 py-4 rounded-lg shadow-lg mb-3 max-w-sm`}>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                            {getIcon()}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm">{title}</h4>
                            {message && (
                                <p className="text-sm opacity-90 mt-1">{message}</p>
                            )}
                        </div>

                        <button
                            onClick={handleClose}
                            className="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <HiX className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 w-full bg-white/20 rounded-full h-1">
                        <div className="bg-white h-1 rounded-full toast-progress" />
                    </div>
                </div>
            </div>
        </>
    );
};

export interface ToastContextType {
    addToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
    removeToast: (id: string) => void;
}

declare global {
    interface Window {
        showToast?: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
    }
}

const ToastContainer = () => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast: ToastProps = {
            ...toast,
            id,
            onClose: removeToast
        };

        setToasts(prev => [...prev, newToast]);
    }, [removeToast]);

    // Expose methods globally for easy use
    useEffect(() => {
        window.showToast = addToast;
        return () => {
            delete window.showToast;
        };
    }, [addToast]);

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map(toast => (
                <Toast key={toast.id} {...toast} />
            ))}
        </div>
    );
};

export default ToastContainer;
