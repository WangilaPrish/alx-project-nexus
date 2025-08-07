import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    FaFacebook,
    FaGithub,
    FaInstagram,
    FaLinkedin,
    FaTwitter
} from 'react-icons/fa';
import {
    HiArrowRight,
    HiCheckCircle,
    HiCollection,
    HiDocumentText,
    HiHeart,
    HiHome,
    HiInformationCircle,
    HiLocationMarker,
    HiMail,
    HiPhone,
    HiSearch,
    HiShieldCheck
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubscribed(true);
        setEmail('');
        setIsSubmitting(false);

        // Reset success state after 3 seconds
        setTimeout(() => setIsSubscribed(false), 3000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const navigationLinks = [
        { to: "/", label: "Home", icon: HiHome },
        { to: "/jobs", label: "Find Jobs", icon: HiSearch },
        { to: "/applied", label: "Applied Jobs", icon: HiCollection },
        { to: "/contact", label: "Contact", icon: HiMail }
    ];

    const resourceLinks = [
        { to: "/about", label: "About Us", icon: HiInformationCircle },
        { to: "/privacy", label: "Privacy Policy", icon: HiShieldCheck },
        { to: "/terms", label: "Terms & Conditions", icon: HiDocumentText }
    ];

    const socialLinks = [
        { href: "https://twitter.com/opportuna", icon: FaTwitter, label: "Twitter", color: "hover:text-blue-400" },
        { href: "https://linkedin.com/company/opportuna", icon: FaLinkedin, label: "LinkedIn", color: "hover:text-blue-600" },
        { href: "https://facebook.com/opportuna", icon: FaFacebook, label: "Facebook", color: "hover:text-blue-800" },
        { href: "https://instagram.com/opportuna", icon: FaInstagram, label: "Instagram", color: "hover:text-pink-500" },
        { href: "https://github.com/opportuna", icon: FaGithub, label: "GitHub", color: "hover:text-gray-900" }
    ];

    const contactInfo = [
        { icon: HiLocationMarker, text: "123 Business Ave, Tech City, TC 12345" },
        { icon: HiPhone, text: "+1 (555) 123-4567" },
        { icon: HiMail, text: "hello@opportuna.com" }
    ];

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:60px_60px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Company Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-1"
                    >
                        <div className="mb-6">
                            <Link to="/" className="flex items-center gap-3 mb-4 group">
                                <div className="relative">
                                    <img
                                        src="/src/assets/logo.png"
                                        alt="Opportuna Logo"
                                        className="h-10 w-auto brightness-0 invert transition-transform group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-blue-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Opportuna
                                </span>
                            </Link>
                            <p className="text-gray-300 text-sm leading-relaxed mb-6">
                                Connecting talented professionals with amazing opportunities.
                                Your next career move starts here.
                            </p>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            {contactInfo.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="flex items-center gap-3 text-sm text-gray-300"
                                >
                                    <item.icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                    <span>{item.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Navigation Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h5 className="font-semibold text-lg mb-6 text-white relative">
                            Explore
                            <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded" />
                        </h5>
                        <ul className="space-y-3">
                            {navigationLinks.map((link) => (
                                <motion.li
                                    key={link.to}
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Link
                                        to={link.to}
                                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-200 group text-sm"
                                    >
                                        <link.icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                                        <span className="group-hover:text-blue-300 transition-colors">
                                            {link.label}
                                        </span>
                                        <HiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-x-2 group-hover:translate-x-0" />
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Resource Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h5 className="font-semibold text-lg mb-6 text-white relative">
                            Resources
                            <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded" />
                        </h5>
                        <ul className="space-y-3">
                            {resourceLinks.map((link) => (
                                <motion.li
                                    key={link.to}
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Link
                                        to={link.to}
                                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-200 group text-sm"
                                    >
                                        <link.icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                                        <span className="group-hover:text-blue-300 transition-colors">
                                            {link.label}
                                        </span>
                                        <HiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-x-2 group-hover:translate-x-0" />
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Newsletter Subscription */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h5 className="font-semibold text-lg mb-6 text-white relative">
                            Stay Updated
                            <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded" />
                        </h5>
                        <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                            Get the latest job opportunities and career tips delivered to your inbox.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isSubmitting || isSubscribed}
                                whileHover={{ scale: isSubscribed ? 1 : 1.02 }}
                                whileTap={{ scale: isSubscribed ? 1 : 0.98 }}
                                className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${isSubscribed
                                        ? 'bg-green-500 text-white cursor-default'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : isSubscribed ? (
                                    <>
                                        <HiCheckCircle className="w-5 h-5" />
                                        Subscribed!
                                    </>
                                ) : (
                                    <>
                                        <HiMail className="w-4 h-4" />
                                        Subscribe
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Social Links */}
                        <div className="mt-8">
                            <p className="text-sm text-gray-400 mb-4">Follow us</p>
                            <div className="flex items-center gap-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                        whileHover={{ scale: 1.2, y: -2 }}
                                        className={`w-10 h-10 rounded-xl bg-gray-800/50 border border-gray-600 flex items-center justify-center text-gray-400 transition-all duration-200 backdrop-blur-sm ${social.color}`}
                                        title={social.label}
                                    >
                                        <social.icon className="w-4 h-4" />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="border-t border-gray-700/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>&copy; {new Date().getFullYear()} Opportuna. All rights reserved.</span>
                        <span className="hidden md:inline">|</span>
                        <span className="flex items-center gap-1">
                            Made with <HiHeart className="w-4 h-4 text-red-400" /> for job seekers
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                            Privacy
                        </Link>
                        <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                            Terms
                        </Link>
                        <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                            Cookies
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />
        </motion.footer>
    );
};

export default Footer;
