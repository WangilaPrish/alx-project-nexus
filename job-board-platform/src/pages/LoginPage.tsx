import { signInWithPopup } from 'firebase/auth';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
    FaCheckCircle,
    FaEnvelope,
    FaExclamationCircle,
    FaEye,
    FaEyeSlash,
    FaLock
} from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import {
    HiArrowRight,
    HiLightningBolt,
    HiX
} from 'react-icons/hi';
import { HiShieldCheck } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase/firebaseConfig';
import { authService } from '../services/authService';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    // Validation functions
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return 'Email is required';
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validatePassword = (password: string) => {
        if (!password) {
            return 'Password is required';
        }
        if (password.length < 6) {
            return 'Password must be at least 6 characters';
        }
        return '';
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(validateEmail(value));
        if (error) setError('');
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(validatePassword(value));
        if (error) setError('');
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);

        setEmailError(emailErr);
        setPasswordError(passwordErr);

        if (emailErr || passwordErr) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await authService.login({ email, password });

            if (result.success) {
                setSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setError(result.message || 'Invalid email or password. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (user) {
                // Send user data to backend
                const userData = {
                    name: user.displayName || '',
                    email: user.email || '',
                    provider_id: user.uid,
                    avatar: user.photoURL || ''
                };

                const authResult = await authService.googleAuth(userData);

                if (authResult.success) {
                    setSuccess('Login successful! Redirecting...');
                    setTimeout(() => {
                        navigate('/');
                    }, 1500);
                } else {
                    setError(authResult.message || 'Google login failed. Please try again.');
                }
            } else {
                setError('Google login failed. Please try again.');
            }
        } catch (err) {
            console.error('Google login error:', err);
            setError('Google login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

            {/* Background Elements - Simplified static gradients */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >


                        <h1 className="text-4xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Welcome Back
                            </span>
                        </h1>

                        <p className="text-gray-600 text-lg">
                            Sign in to continue your job search journey
                        </p>
                    </motion.div>

                    {/* Login Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8"
                    >
                        {/* Success Message */}
                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3"
                                >
                                    <FaCheckCircle className="text-green-500 text-xl" />
                                    <span className="text-green-700 font-medium">{success}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3"
                                >
                                    <FaExclamationCircle className="text-red-500 text-xl" />
                                    <div className="flex-1">
                                        <span className="text-red-700 font-medium">{error}</span>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setError('')}
                                            className="ml-2 text-red-400 hover:text-red-600"
                                        >
                                            <HiX className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleEmailLogin} className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${emailError
                                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                            }`}
                                        disabled={isLoading}
                                    />
                                    {email && !emailError && (
                                        <FaCheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500" />
                                    )}
                                </div>
                                {emailError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 text-sm text-red-600 flex items-center gap-1"
                                    >
                                        <FaExclamationCircle className="w-3 h-3" />
                                        {emailError}
                                    </motion.p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${passwordError
                                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                            }`}
                                        disabled={isLoading}
                                    />
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </motion.button>
                                </div>
                                {passwordError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 text-sm text-red-600 flex items-center gap-1"
                                    >
                                        <FaExclamationCircle className="w-3 h-3" />
                                        {passwordError}
                                    </motion.p>
                                )}
                            </div>

                            {/* Forgot Password Link */}
                            <div className="text-right">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Forgot your password?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading || !!emailError || !!passwordError}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <HiLightningBolt className="w-5 h-5" />
                                        Sign In
                                        <HiArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Divider */}
                        <div className="my-8 flex items-center">
                            <div className="flex-1 border-t border-gray-200"></div>
                            <div className="px-4 text-gray-500 text-sm font-medium">or continue with</div>
                            <div className="flex-1 border-t border-gray-200"></div>
                        </div>

                        {/* Google Login */}
                        <motion.button
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full border-2 border-gray-200 bg-white py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FcGoogle size={24} />
                            <span className="font-semibold text-gray-700">Continue with Google</span>
                            <HiShieldCheck className="w-5 h-5 text-green-500" />
                        </motion.button>

                        {/* Sign Up Link */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                                >
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </motion.div>

                    {/* Security Notice */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-8 text-center"
                    >
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <HiShieldCheck className="w-4 h-4 text-green-500" />
                            <span>Your data is protected with enterprise-grade security</span>
                        </div>
                    </motion.div>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;
