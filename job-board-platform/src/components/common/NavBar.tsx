import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
    HiBriefcase,
    HiCollection,
    HiHome,
    HiLogout,
    HiMenuAlt3,
    HiSearch,
    HiX
} from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { useAppliedJobs } from '../../context/AppliedJobsContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { appliedJobs } = useAppliedJobs();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(prev => !prev);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
        setShowUserMenu(false);
    }, [location]);

    const navItems = [
        {
            to: "/",
            label: "Home",
            icon: HiHome,
            show: true
        },
        {
            to: "/all-jobs",
            label: "All Jobs",
            icon: HiBriefcase,
            show: true
        },
        {
            to: "/jobs",
            label: "Find Jobs",
            icon: HiSearch,
            show: true
        },
        {
            to: "/external-jobs",
            label: "External Jobs",
            icon: HiBriefcase,
            show: true
        },
        {
            to: "/applied",
            label: "Applied Jobs",
            icon: HiCollection,
            show: !!user,
            badge: appliedJobs.length > 0 ? appliedJobs.length : undefined
        }
    ];

    const authItems = [
        { to: "/login", label: "Sign In", show: !user },
        { to: "/register", label: "Register", show: !user, isPrimary: true }
    ];

    const isActiveRoute = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <motion.nav
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-4 sm:px-6 lg:px-8 py-3 w-full fixed top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg bg-white/98' : 'shadow-sm'
                }`}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                >
                    <Link
                        to="/"
                        className="flex items-center gap-3 text-blue-600 font-bold text-xl group"
                    >
                        <div className="relative">
                            <img
                                src="/src/assets/logo.png"
                                alt="Opportuna Logo"
                                className="h-10 w-auto transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-blue-600/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                        </div>
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Opportuna
                        </span>
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1">
                    {navItems.map((item, index) =>
                        item.show && (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.1 }}
                                className="relative"
                            >
                                <Link
                                    to={item.to}
                                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${isActiveRoute(item.to)
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                    {item.badge && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                                        >
                                            {item.badge}
                                        </motion.span>
                                    )}
                                    {isActiveRoute(item.to) && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-blue-100 rounded-xl -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        )
                    )}
                </div>

                {/* Auth Section */}
                <div className="hidden lg:flex items-center gap-4">
                    {!user ? (
                        <div className="flex items-center gap-3">
                            {authItems.map((item, index) =>
                                item.show && (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                        <Link
                                            to={item.to}
                                            className={`text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 ${item.isPrimary
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                                                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                    {user.displayName?.[0] || user.email?.[0] || 'U'}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user.displayName || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user.email}
                                    </p>
                                </div>
                            </motion.button>

                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.displayName || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Link
                                            to="/applied"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <HiBriefcase className="w-4 h-4" />
                                            Applied Jobs
                                            {appliedJobs.length > 0 && (
                                                <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                                                    {appliedJobs.length}
                                                </span>
                                            )}
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setShowUserMenu(false);
                                            }}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                        >
                                            <HiLogout className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleMenu}
                        className="p-2 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 180 }}
                                    exit={{ rotate: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <HiX className="w-6 h-6 text-gray-700" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 0 }}
                                    exit={{ rotate: 180 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <HiMenuAlt3 className="w-6 h-6 text-gray-700" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-md border-t border-gray-200 mt-3"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {navItems.map((item) =>
                                item.show && (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Link
                                            to={item.to}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActiveRoute(item.to)
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                                }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.label}
                                            {item.badge && (
                                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </motion.div>
                                )
                            )}

                            {user ? (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="pt-4 border-t border-gray-200"
                                >
                                    <div className="flex items-center gap-3 px-4 py-3 text-sm">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                            {user.displayName?.[0] || user.email?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {user.displayName || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full text-left"
                                    >
                                        <HiLogout className="w-5 h-5" />
                                        Sign Out
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="pt-4 border-t border-gray-200 space-y-2"
                                >
                                    {authItems.map((item) =>
                                        item.show && (
                                            <Link
                                                key={item.label}
                                                to={item.to}
                                                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.isPrimary
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center'
                                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                                    }`}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {item.label}
                                            </Link>
                                        )
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
