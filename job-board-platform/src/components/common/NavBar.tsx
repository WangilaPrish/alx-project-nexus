import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-white shadow-sm w-full">
            {/* Logo */}
            <div className="h-8 font-bold text-blue-600">
                <Link to="/">
                    <img src="src/assets/logo.png" alt="Logo" className="h-32 pb-16" />
                </Link>
            </div>

            {/* Optional Nav Links */}


            {/* Auth Buttons */}
            <div className="flex gap-4 items-center">
                <button className="text-sm text-gray-600 hover:text-blue-600 transition">Sign In</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Register</button>
            </div>
        </nav>
    );
};

export default Navbar;
