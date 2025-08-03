import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-white shadow-sm w-full">
            {/* Logo */}
            <div className="text-2xl font-bold text-blue-600">
                <Link to="/">Opportuna</Link>
            </div>

            {/* Optional Nav Links */}
            <ul className="hidden lg:flex gap-6 text-gray-700 font-medium">
                <li><Link to="/">Home</Link></li>
                <li><a href="#">Find Job</a></li>
                <li><a href="#">Company</a></li>
                <li><a href="#">Create CV</a></li>
            </ul>

            {/* Auth Buttons */}
            <div className="flex gap-4 items-center">
                <button className="text-sm text-gray-600 hover:text-blue-600 transition">Sign In</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Register</button>
            </div>
        </nav>
    );
};

export default Navbar;
