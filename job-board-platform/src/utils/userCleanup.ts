import { authService } from '../services/authService';

/**
 * Utility functions for cleaning up user data between Firebase and backend database
 */

export const userCleanup = {
    /**
     * Delete user from backend database (for users already deleted from Firebase)
     * @param email - Email of the user to delete from database
     */
    deleteFromDatabase: async (email: string) => {
        try {
            console.log(`Attempting to delete user ${email} from database...`);
            const result = await authService.deleteUserFromDatabase(email);

            if (result.success) {
                console.log(`Successfully deleted user ${email} from database`);
                return {
                    success: true,
                    message: `User ${email} deleted from database`
                };
            } else {
                console.error(`Failed to delete user ${email} from database:`, result.message);
                return result;
            }
        } catch (error) {
            console.error('Error deleting user from database:', error);
            return {
                success: false,
                message: 'Failed to delete user from database'
            };
        }
    },

    /**
     * Batch delete multiple users from database
     * @param emails - Array of email addresses to delete
     */
    batchDeleteFromDatabase: async (emails: string[]) => {
        const results = [];

        for (const email of emails) {
            const result = await userCleanup.deleteFromDatabase(email);
            results.push({ email, ...result });

            // Add small delay between requests to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return results;
    },

    /**
     * Get list of users that might need cleanup
     * This would require a backend endpoint to compare Firebase users with database users
     */
    getOrphanedUsers: async () => {
        try {
            const response = await fetch(`${authService.getAuthHeaders().baseURL || 'http://localhost:5000/api'}/auth/orphaned-users`, {
                headers: authService.getAuthHeaders()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting orphaned users:', error);
            return {
                success: false,
                message: 'Failed to get orphaned users list'
            };
        }
    }
};

// Quick cleanup function for the specific email you mentioned
export const cleanupSpecificUser = async () => {
    const email = 'maxymandie@gmail.com';
    console.log('Cleaning up user:', email);

    const result = await userCleanup.deleteFromDatabase(email);
    console.log('Cleanup result:', result);

    return result;
};
