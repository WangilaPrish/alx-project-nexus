import { motion } from 'framer-motion';
import { HiExclamation, HiTrash, HiX } from 'react-icons/hi';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    jobTitle: string;
    companyName: string;
}

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    jobTitle,
    companyName
}: DeleteConfirmationModalProps) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <HiExclamation className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Remove Application
                        </h3>
                        <p className="text-sm text-gray-600">
                            This action cannot be undone
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                        Are you sure you want to remove your application for:
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                {companyName[0]}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{jobTitle}</h4>
                                <p className="text-sm text-gray-600">{companyName}</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                        This will permanently remove the application from your tracking list.
                        You'll lose any notes and status updates associated with this application.
                    </p>
                </div>

                <div className="flex gap-3 justify-end">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirm}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2 shadow-lg"
                    >
                        <HiTrash className="w-4 h-4" />
                        Remove Application
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default DeleteConfirmationModal;
