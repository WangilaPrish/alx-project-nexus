// Simple cleanup function that you can copy-paste into browser console
// This will help clean up the user from your database

async function cleanupUserFromDatabase(email = 'maxymandie@gmail.com') {
    try {
        console.log(`Attempting to delete user ${email} from database...`);

        const response = await fetch('http://localhost:5003/api/auth/delete-user-db', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (result.success) {
            console.log(`✅ Successfully deleted user ${email} from database`);
            return result;
        } else {
            console.log(`❌ Failed to delete user: ${result.message}`);
            return result;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);

        if (error.message.includes('fetch')) {
            console.log('💡 Make sure your backend server is running on http://localhost:5003');
        }

        return {
            success: false,
            message: 'Network error or backend not running'
        };
    }
}

// Run the cleanup
console.log('🚀 Starting user cleanup...');
cleanupUserFromDatabase();
