import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/firebaseConfig';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            navigate('/'); // Redirect to home
        } catch (err) {
            console.error(err);
            alert("Google login failed!");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                Login
            </button>

            <div className="text-center my-4 text-gray-500">or</div>

            <button
                onClick={handleGoogleLogin}
                className="w-full border border-gray-300 py-2 rounded hover:bg-gray-50"
            >
                Continue with Google
            </button>
        </div>
    );
};

export default LoginPage;
