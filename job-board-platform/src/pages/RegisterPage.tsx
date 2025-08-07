import { signInWithPopup } from 'firebase/auth';
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
            // Simulate registration process - replace with actual Firebase createUserWithEmailAndPassword
            await new Promise(resolve => setTimeout(resolve, 2000));

            setSuccess('Registration successful! Redirecting...');
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch {
            // Simulate error handling
            setError('Registration failed. Please try again.');
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
                console.log('Registered user:', user.email);
                setSuccess('Registration successful! Redirecting...');
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Google registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-full blur-3xl"
                />
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
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
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
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </motion.button>
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
                            <motion.button
                                type="submit"
                                disabled={isLoading || nameError !== '' || emailError !== '' || passwordError !== '' || confirmPasswordError !== ''}
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                className={`w-full py-4 rounded-2xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${isLoading || nameError !== '' || emailError !== '' || passwordError !== '' || confirmPasswordError !== ''
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <HiLightningBolt className="w-5 h-5" />
                                        Create Account
                                        <HiArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>

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
                            <motion.button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                className="w-full py-4 border-2 border-gray-200 rounded-2xl flex items-center justify-center gap-3 hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FcGoogle className="w-6 h-6" />
                                Sign up with Google
                            </motion.button>

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
