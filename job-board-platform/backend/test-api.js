// Quick test script for API endpoints
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:50001/api';

async function testRegistration() {
    try {
        console.log('🧪 Testing user registration...');
        
        // Use timestamp to ensure unique email
        const timestamp = Date.now();
        const testEmail = `test${timestamp}@example.com`;
        
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Test User',
                email: testEmail,
                password: 'Test123',
                confirmPassword: 'Test123'
            })
        });

        const data = await response.json();
        console.log('📊 Registration Response:', data);
        
        if (data.success) {
            console.log('✅ Registration successful!');
            console.log('👤 User:', data.data.user);
            console.log('🔑 Token:', data.data.token ? 'Generated' : 'Missing');
            return testEmail; // Return email for login test
        } else {
            console.log('❌ Registration failed:', data.message);
            return null;
        }
        
    } catch (error) {
        console.error('💥 Test error:', error.message);
        return null;
    }
}

async function testLogin(email = null) {
    try {
        console.log('\n🧪 Testing user login...');
        
        const loginEmail = email || 'test@example.com';
        
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: loginEmail,
                password: 'Test123'
            })
        });

        const data = await response.json();
        console.log('📊 Login Response:', data);
        
        if (data.success) {
            console.log('✅ Login successful!');
            console.log('👤 User:', data.data.user);
            console.log('🔑 Token:', data.data.token ? 'Generated' : 'Missing');
        } else {
            console.log('❌ Login failed:', data.message);
        }
        
    } catch (error) {
        console.error('💥 Test error:', error.message);
    }
}

async function testHealthCheck() {
    try {
        console.log('\n🧪 Testing health check...');
        
        const response = await fetch(`${API_BASE.replace('/api', '')}/health`);
        const data = await response.json();
        
        console.log('📊 Health Response:', data);
        
        if (data.success) {
            console.log('✅ Server is healthy!');
        } else {
            console.log('❌ Server health check failed');
        }
        
    } catch (error) {
        console.error('💥 Health check error:', error.message);
    }
}

async function runTests() {
    console.log('🚀 Starting API Tests...\n');
    
    await testHealthCheck();
    const registeredEmail = await testRegistration();
    await testLogin(registeredEmail);
    
    console.log('\n✨ Tests completed!');
}

runTests();
