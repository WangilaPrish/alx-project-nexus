import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(prev => !prev);

    const navItems = [
        { to: "/jobs", label: "Find Jobs", show: true },
        { to: "/applied", label: "Jobs Applied", show: !!user },
        { to: "/login", label: "Sign In", show: !user },
        { to: "/register", label: "Register", show: !user }
    ];

    const mobileMenuVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: 'easeOut' }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.2, ease: 'easeIn' }
        }
    };

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow px-6 md:px-12 py-4 w-full fixed top-0 z-50"
        >
            <div className="flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
                    <img src="src/assets/logo.png" alt="Opportuna Logo" className="h-10 w-auto" />
                    <span>Opportuna</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item, index) =>
                        item.show && (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                            >
                                <Link
                                    to={item.to}
                                    className={`text-sm ${item.label === "Register"
                                        ? "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        : "text-gray-700 hover:text-blue-600"
                                        } transition font-medium`}
                                >
                                    {item.label}
                                </Link>
                            </motion.div>
                        )
                    )}

                    {user && (
                        <>
                            <span className="text-sm text-gray-700 font-medium">
                                {user.displayName || user.email}
                            </span>
                            <button
                                onClick={logout}
                                className="text-sm text-red-500 hover:text-red-700 transition font-medium"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden">
                    <button onClick={toggleMenu}>
                        {isOpen ? (
                            <HiX className="w-6 h-6 text-gray-700" />
                        ) : (
                            <HiMenuAlt3 className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="md:hidden mt-4 flex flex-col gap-4"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={mobileMenuVariants}
                    >
                        {navItems.map(
                            item =>
                                item.show && (
                                    <Link
                                        key={item.label}
                                        to={item.to}
                                        className={`text-sm px-4 py-2 ${item.label === "Register"
                                            ? "bg-blue-600 text-white rounded hover:bg-blue-700"
                                            : "text-gray-700 hover:text-blue-600"
                                            } transition font-medium`}
                                        onClick={() => setIsOpen(false)} // Close menu on link click
                                    >
                                        {item.label}
                                    </Link>
                                )
                        )}
                        {user && (
                            <>
                                <span className="text-sm text-gray-700 font-medium px-4">
                                    {user.displayName || user.email}
                                </span>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="text-sm text-red-500 hover:text-red-700 transition font-medium px-4 text-left"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
