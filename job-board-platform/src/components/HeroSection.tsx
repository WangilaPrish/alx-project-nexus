import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
    HiArrowRight,
    HiBriefcase,
    HiLocationMarker,
    HiPlay,
    HiSearch,
    HiSparkles,
    HiTrendingUp,
    HiUsers
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';

const HeroSection = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleJobseekerClick = () => {
        navigate('/jobs');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/jobs?search=${searchTerm}&location=${location}`);
    };

    // Animated text rotation
    const rotatingTexts = [
        "Dream Job",
        "Perfect Career",
        "Next Adventure",
        "Future Role"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % rotatingTexts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [rotatingTexts.length]);

    // Stats data
    const stats = [
        { icon: HiBriefcase, value: "50K+", label: "Jobs Available" },
        { icon: HiUsers, value: "25K+", label: "Happy Users" },
        { icon: HiTrendingUp, value: "98%", label: "Success Rate" }
    ];

    // Popular job categories
    const popularCategories = [
        "Frontend Developer",
        "Data Scientist",
        "Product Manager",
        "UI/UX Designer"
    ];

    return (
        <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                {/* Gradient Orbs */}
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.1, 1, 1.1],
                        opacity: [0.4, 0.2, 0.4]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />

                {/* Floating Icons */}
                <motion.div
                    className="absolute top-32 right-20 text-blue-400/30"
                    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                >
                    <HiSparkles className="w-8 h-8" />
                </motion.div>
                <motion.div
                    className="absolute bottom-40 left-20 text-purple-400/30"
                    animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                >
                    <HiBriefcase className="w-6 h-6" />
                </motion.div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 min-h-screen flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

                    {/* Left Content */}
                    <div className="text-center lg:text-left space-y-8">



                        {/* Main Heading */}
                        <div className="space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                            >
                                Find Your{' '}
                                <motion.span
                                    key={currentIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_100%] animate-[gradient_3s_ease_infinite]"
                                >
                                    {rotatingTexts[currentIndex]}
                                </motion.span>
                            </motion.h1>
                        </div>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed"
                        >
                            Connect with top companies and discover opportunities that match your skills,
                            passion, and career goals. Your perfect job is just one search away.
                        </motion.p>

                        {/* Search Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
                        >
                            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Job title or keywords"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="flex-1 relative">
                                    <HiLocationMarker className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <span>Search Jobs</span>
                                    <HiArrowRight className="w-4 h-4" />
                                </motion.button>
                            </form>

                            {/* Popular Categories */}
                            <div className="mt-6">
                                <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
                                <div className="flex flex-wrap gap-2">
                                    {popularCategories.map((category, index) => (
                                        <motion.button
                                            key={category}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.8 + index * 0.1 }}
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => {
                                                setSearchTerm(category);
                                                navigate(`/jobs?search=${category}`);
                                            }}
                                            className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg text-sm transition-all duration-200"
                                        >
                                            {category}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleJobseekerClick}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 justify-center shadow-lg hover:shadow-xl"
                            >
                                <HiBriefcase className="w-5 h-5" />
                                Browse All Jobs
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-white transition-all duration-200 flex items-center gap-2 justify-center shadow-lg hover:shadow-xl border border-gray-200"
                            >
                                <HiPlay className="w-4 h-4" />
                                Watch Demo
                            </motion.button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1 }}
                            className="grid grid-cols-3 gap-8 pt-8"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.2 + index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="flex justify-center mb-2">
                                        <div className="p-3 bg-blue-100 rounded-xl">
                                            <stat.icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Content - Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative flex justify-center lg:justify-end"
                    >
                        {/* Main Image Container */}
                        <div className="relative">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl scale-110" />

                            {/* Hero Image */}
                            <motion.div
                                animate={{
                                    y: [0, -15, 0],
                                    rotate: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="relative z-10"
                            >
                                <img
                                    src={heroImg}
                                    alt="Find your dream job"
                                    className="w-full max-w-lg rounded-3xl shadow-2xl"
                                />
                            </motion.div>

                            {/* Floating Cards */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: [0, -10, 0]
                                }}
                                transition={{
                                    opacity: { delay: 1.5, duration: 0.5 },
                                    scale: { delay: 1.5, duration: 0.5 },
                                    y: { duration: 4, repeat: Infinity, delay: 1 }
                                }}
                                className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/20"
                            >

                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: [0, -8, 0]
                                }}
                                transition={{
                                    opacity: { delay: 2, duration: 0.5 },
                                    scale: { delay: 2, duration: 0.5 },
                                    y: { duration: 5, repeat: Infinity, delay: 2 }
                                }}
                                className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/20"
                            >

                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 w-full">
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="relative block w-full h-16 fill-white"
                >
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                        opacity=".25"
                    />
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                        opacity=".5"
                    />
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
                </svg>
            </div>
        </section>
    );
};

export default HeroSection;
