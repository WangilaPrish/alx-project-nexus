import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
    FaCheckCircle,
    FaEnvelope,
    FaExclamationCircle,
    FaEye,
    FaEyeSlash,
    FaLock,
    FaUser
} from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import {
    HiArrowRight,
    HiLightningBolt,
    HiSparkles,
    HiX
} from 'react-icons/hi';
import { HiShieldCheck } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase/firebaseConfig';
import { authService } from '../services/authService';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const navigate = useNavigate();

    // Validation functions
    const validateName = (name: string) => {
        if (!name) {
            return 'Full name is required';
        }
        if (name.length < 2) {
            return 'Name must be at least 2 characters';
        }
        return '';
    };

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
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return 'Password must contain uppercase, lowercase, and numbers';
        }
        return '';
    };

    const validateConfirmPassword = (confirmPassword: string, password: string) => {
        if (!confirmPassword) {
            return 'Please confirm your password';
        }
        if (confirmPassword !== password) {
            return 'Passwords do not match';
        }
        return '';
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        setNameError(validateName(value));
        if (error) setError('');
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
        setConfirmPasswordError(validateConfirmPassword(confirmPassword, value));
        if (error) setError('');
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setConfirmPasswordError(validateConfirmPassword(value, password));
        if (error) setError('');
    };

    const handleEmailRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const nameErr = validateName(name);
        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);
        const confirmPasswordErr = validateConfirmPassword(confirmPassword, password);

        setNameError(nameErr);
        setEmailError(emailErr);
        setPasswordError(passwordErr);
        setConfirmPasswordError(confirmPasswordErr);

        if (nameErr || emailErr || passwordErr || confirmPasswordErr) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Create user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update the user's display name
            await updateProfile(user, {
                displayName: name
            });

            // Also save user to MySQL database via backend API
            try {
                console.log('Attempting to save user to backend database...', { name, email });
                const backendResponse = await authService.register({
                    name,
                    email,
                    password,
                    confirmPassword
                });

                console.log('Backend response:', backendResponse);

                if (backendResponse.success) {
                    console.log('✅ User successfully saved to database');
                } else {
                    console.warn('❌ Failed to save user to backend database:', backendResponse.message);
                    // You could show this to the user as a warning
                    setError(`Warning: ${backendResponse.message || 'Failed to save to database'}`);
                }
            } catch (backendError: any) {
                console.error('❌ Backend registration failed:', backendError);
                // Show this error to the user
                setError(`Database error: ${backendError.message || 'Could not connect to database'}`);
                // Continue even if backend fails, Firebase user is created
            }

            setSuccess('Registration successful! Redirecting...');
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (err: any) {
            console.error('Registration error:', err);

            // Handle specific Firebase errors
            let errorMessage = 'Registration failed. Please try again.';

            if (err.code) {
                switch (err.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'This email is already registered. Try logging in instead.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password is too weak. Please choose a stronger password.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email address.';
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = 'Network error. Please check your connection and try again.';
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage = 'Email/password registration is not enabled. Please contact support or use Google sign-in.';
                        break;
                    default:
                        errorMessage = err.message || 'Registration failed. Please try again.';
                }
            }

            setError(errorMessage);
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

                console.log('Sending user data to backend:', userData);
                const authResult = await authService.googleAuth(userData);
                console.log('Backend response:', authResult);

                if (authResult.success) {
                    setSuccess('Registration successful! Redirecting...');
                    setTimeout(() => {
                        navigate('/');
                    }, 1500);
                } else {
                    console.error('Google auth failed:', authResult);
                    setError(authResult.message || 'Google registration failed. Please try again.');
                }
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Google registration error:', err);
            // More detailed error information
            if (err && typeof err === 'object' && 'code' in err && 'message' in err) {
                setError(`Google authentication failed: ${err.code} - ${err.message}`);
            } else {
                setError('Google registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Background Elements - Simplified static gradients */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-r from-blue-400/10 to-green-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-center mb-8"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
                        >
                            <HiSparkles className="w-10 h-10 text-white" />
                        </motion.div>

                        <h1 className="text-4xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Join Opportuna
                            </span>
                        </h1>

                        <p className="text-gray-600 text-lg">
                            Create your account and start your journey
                        </p>
                    </motion.div>

                    {/* Registration Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
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
                                        <button
                                            type="button"
                                            onClick={() => setError('')}
                                            className="ml-2 text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <HiX className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleEmailRegister} className="space-y-6">
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={handleNameChange}
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${nameError
                                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                                            : 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
                                            }`}
                                        disabled={isLoading}
                                    />
                                    {name && !nameError && (
                                        <FaCheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500" />
                                    )}
                                </div>
                                {nameError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 text-sm text-red-600 flex items-center gap-1"
                                    >
                                        <FaExclamationCircle className="w-3 h-3" />
                                        {nameError}
                                    </motion.p>
                                )}
                            </div>

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
                                            : 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
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
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${passwordError
                                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                                            : 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
                                            }`}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
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

                            {/* Confirm Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <HiShieldCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${confirmPasswordError
                                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                                            : 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
                                            }`}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {confirmPasswordError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 text-sm text-red-600 flex items-center gap-1"
                                    >
                                        <FaExclamationCircle className="w-3 h-3" />
                                        {confirmPasswordError}
                                    </motion.p>
                                )}
                            </div>

                            {/* Sign Up Button */}
                            <button
                                type="submit"
                                disabled={isLoading || nameError !== '' || emailError !== '' || passwordError !== '' || confirmPasswordError !== ''}
                                className={`w-full py-4 rounded-2xl font-semibold text-white transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${isLoading || nameError !== '' || emailError !== '' || passwordError !== '' || confirmPasswordError !== ''
                                    ? 'bg-gray-400 cursor-not-allowed hover:scale-100'
                                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <HiLightningBolt className="w-5 h-5" />
                                        Create Account
                                        <HiArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">or continue with</span>
                                </div>
                            </div>

                            {/* Google Sign Up Button */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full py-4 border-2 border-gray-200 rounded-2xl flex items-center justify-center gap-3 hover:border-gray-300 hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <FcGoogle className="w-6 h-6" />
                                Sign up with Google
                            </button>

                            {/* Login Link */}
                            <div className="text-center">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
