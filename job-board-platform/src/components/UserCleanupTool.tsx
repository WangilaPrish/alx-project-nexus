import { useState } from 'react';
import { cleanupSpecificUser, userCleanup } from '../utils/userCleanup';

const UserCleanupTool = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

    const handleCleanupSpecific = async () => {
        setIsLoading(true);
        setMessage('');

        try {
            const result = await cleanupSpecificUser();

            if (result.success) {
                setMessage(result.message);
                setMessageType('success');
            } else {
                setMessage(result.message);
                setMessageType('error');
            }
        } catch (error) {
            setMessage('An error occurred during cleanup');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCleanupCustom = async () => {
        if (!email.trim()) {
            setMessage('Please enter an email address');
            setMessageType('error');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const result = await userCleanup.deleteFromDatabase(email.trim());

            if (result.success) {
                setMessage(result.message);
                setMessageType('success');
                setEmail('');
            } else {
                setMessage(result.message);
                setMessageType('error');
            }
        } catch (error) {
            setMessage('An error occurred during cleanup');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">User Cleanup Tool</h2>
            <p className="text-sm text-gray-600 mb-6">
                Use this tool to remove users from the database that were already deleted from Firebase.
            </p>

            {/* Quick cleanup for specific user */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Quick Cleanup</h3>
                <button
                    onClick={handleCleanupSpecific}
                    disabled={isLoading}
                    className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-2 px-4 rounded transition-colors"
                >
                    {isLoading ? 'Cleaning...' : 'Delete maxymandie@gmail.com from Database'}
                </button>
            </div>

            {/* Custom email cleanup */}
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Custom Email Cleanup</h3>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email to delete from database"
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <button
                    onClick={handleCleanupCustom}
                    disabled={isLoading || !email.trim()}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-2 px-4 rounded transition-colors"
                >
                    {isLoading ? 'Cleaning...' : 'Delete from Database'}
                </button>
            </div>

            {/* Message display */}
            {message && (
                <div className={`p-3 rounded ${messageType === 'success'
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-red-100 text-red-700 border border-red-300'
                    }`}>
                    {message}
                </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
                <p><strong>Note:</strong> This tool only removes users from your MySQL database.
                    Users in Firebase Authentication need to be deleted manually from the Firebase Console.</p>
            </div>
        </div>
    );
};

export default UserCleanupTool;
