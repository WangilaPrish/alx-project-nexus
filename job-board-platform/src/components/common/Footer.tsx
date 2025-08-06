import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-gray-100 text-gray-700 px-6 py-10 mt-20 border-t"
        >
            {/* Grid layout with 3 columns */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                <motion.div variants={itemVariants}>
                    <h5 className="font-semibold mb-2">Explore</h5>
                    <ul className="space-y-1">
                        <li><Link to="/" className="hover:text-blue-600 transition">Home</Link></li>
                        <li><Link to="/jobs" className="hover:text-blue-600 transition">Jobs</Link></li>
                        <li><Link to="/categories" className="hover:text-blue-600 transition">Categories</Link></li>
                        <li><Link to="/contact" className="hover:text-blue-600 transition">Contact</Link></li>
                    </ul>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <h5 className="font-semibold mb-2">Resources</h5>
                    <ul className="space-y-1">
                        <li><Link to="/about" className="hover:text-blue-600 transition">About Us</Link></li>
                        <li><Link to="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="hover:text-blue-600 transition">Terms & Conditions</Link></li>
                    </ul>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <h5 className="font-semibold mb-2">Subscribe</h5>
                    <p className="text-sm text-gray-600 mb-3">Stay updated with our latest job postings and tips.</p>
                    <form className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="px-3 py-2 rounded border border-gray-300 w-full focus:outline-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Subscribe
                        </button>
                    </form>
                </motion.div>

            </div>

            {/* Bottom row */}
            <div className="mt-10 border-t pt-4 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Opportuna. All rights reserved.
            </div>
        </motion.footer>
    );
};


export default Footer;
