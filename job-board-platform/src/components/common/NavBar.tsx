import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-white shadow w-full">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
                <img src="src/assets/logo.png" alt="Opportuna Logo" className="h-10 w-auto" />
                <span>Opportuna</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
                <Link
                    to="/jobs"
                    className="text-sm text-gray-700 hover:text-blue-600 transition font-medium"
                >
                    Find Jobs
                </Link>

                {user && (
                    <Link
                        to="/applied"
                        className="text-sm text-gray-700 hover:text-blue-600 transition font-medium"
                    >
                        Jobs Applied
                    </Link>
                )}

                {user ? (
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
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="text-sm text-gray-600 hover:text-blue-600 transition font-medium"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
