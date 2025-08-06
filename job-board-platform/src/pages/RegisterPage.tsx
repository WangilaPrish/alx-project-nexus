import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/firebaseConfig';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaLock, FaEnvelope } from 'react-icons/fa';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (user) {
                console.log('Logged in user:', user.email);
                navigate('/'); // ✅ Redirect only if user is authenticated
            } else {
                alert('Login failed. No user returned.');
            }
        } catch (err) {
            console.error(err);
            alert("Google register failed!");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto mt-36 p-8 bg-white shadow-xl rounded-lg"
        >
            <motion.h2
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-3xl font-bold mb-6 text-center text-blue-600"
            >
                Welcome to Opportuna 👋
            </motion.h2>

            <div className="space-y-4">
                <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-blue-500"
                    />
                </div>
                <div className="relative">
                    <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-blue-500"
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
                >
                    SIgn Up
                </motion.button>

                <div className="text-center my-2 text-gray-500">or</div>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGoogleLogin}
                    className="w-full border border-gray-300 py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition"
                >
                    <FcGoogle size={22} />
                    <span>Continue with Google</span>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default RegisterPage;
