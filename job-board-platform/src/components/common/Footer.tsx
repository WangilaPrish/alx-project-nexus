import { motion } from 'framer-motion';

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
            variants={containerVariants}
            className="bg-gray-100 text-gray-700 mt-16"
        >
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                {/* Column 1 */}
                <motion.div variants={itemVariants}>
                    <h4 className="font-semibold text-lg mb-3 text-blue-600">Opportuna</h4>
                    <p>
                        Empowering job seekers to find their path. Your future begins with the right opportunity.
                    </p>
                </motion.div>

                {/* Column 2 */}
                <motion.div variants={itemVariants}>
                    <h5 className="font-semibold mb-2">Explore</h5>
                    <ul className="space-y-1">
                        {['Home', 'Jobs', 'Categories', 'Contact'].map((item) => (
                            <li key={item}>
                                <a href="#" className="hover:text-blue-600 transition">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Column 3 */}
                <motion.div variants={itemVariants}>
                    <h5 className="font-semibold mb-2">Stay Connected</h5>
                    <p className="mb-2">Join our newsletter for job updates.</p>
                    <motion.form
                        className="flex"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <input
                            type="email"
                            placeholder="Your email"
                            className="px-3 py-2 border rounded-l-md w-full text-sm"
                        />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition">
                            Subscribe
                        </button>
                    </motion.form>
                </motion.div>
            </div>

            <motion.div
                className="border-t border-gray-200 text-center text-xs py-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                © {new Date().getFullYear()} Opportuna. All rights reserved.
            </motion.div>
        </motion.footer>
    );
};

export default Footer;
