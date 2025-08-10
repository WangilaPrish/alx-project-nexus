// Simple test script to verify backend connection
// Run this in browser console to test if backend is responding

async function testBackendConnection() {
    const baseURL = 'http://localhost:5003/api';

    console.log('🧪 Testing backend connection...');

    try {
        // Test 1: Basic connectivity
        console.log('Test 1: Basic connectivity');
        const response = await fetch(`${baseURL}/auth/register`, {
            method: 'OPTIONS',
        });
        console.log('✅ CORS preflight:', response.status);

        // Test 2: Test registration endpoint
        console.log('Test 2: Registration endpoint');
        const testData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123'
        };

        const regResponse = await fetch(`${baseURL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        const regResult = await regResponse.json();
        console.log('Registration test result:', regResult);

        // Test 3: Test Google auth endpoint
        console.log('Test 3: Google auth endpoint');
        const googleData = {
            name: 'Test Google User',
            email: 'testgoogle@example.com',
            provider_id: 'test123',
            avatar: 'https://example.com/avatar.jpg'
        };

        const googleResponse = await fetch(`${baseURL}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(googleData)
        });

        const googleResult = await googleResponse.json();
        console.log('Google auth test result:', googleResult);

        console.log('🎉 Backend tests completed!');

    } catch (error) {
        console.error('❌ Backend test failed:', error);
    }
}

// Auto-run the test
testBackendConnection();
