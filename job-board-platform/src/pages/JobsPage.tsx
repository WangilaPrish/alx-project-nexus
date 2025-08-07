import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
    HiAdjustments,
    HiBriefcase,
    HiFilter,
    HiLocationMarker,
    HiSearch,
    HiSparkles,
    HiTrendingUp,
    HiUsers
} from 'react-icons/hi';
import { useSearchParams } from 'react-router-dom';
import JobList from '../components/JobList';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/NavBar';
import { useJobContext } from '../context/JobContext';

const JobsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { jobs } = useJobContext();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [location, setLocation] = useState(searchParams.get('location') || '');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedExperience, setSelectedExperience] = useState(searchParams.get('experience') || '');
    const [selectedJobType, setSelectedJobType] = useState(searchParams.get('type') || '');

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (location) params.set('location', location);
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedExperience) params.set('experience', selectedExperience);
        if (selectedJobType) params.set('type', selectedJobType);

        setSearchParams(params, { replace: true });
    }, [searchTerm, location, selectedCategory, selectedExperience, selectedJobType, setSearchParams]);

    // Job statistics
    const totalJobs = jobs.length;
    const newJobsThisWeek = jobs.filter(job => {
        const jobDate = new Date(job.postedAt || '');
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return jobDate >= weekAgo;
    }).length;

    const uniqueCompanies = new Set(jobs.map(job => job.company)).size;

    // Filter options
    const categories = Array.from(new Set(jobs.map(job => job.experienceLevel))).filter(Boolean);
    const jobTypes = Array.from(new Set(jobs.map(job => job.type))).filter(Boolean);
    const experienceLevels = ['Entry-level', 'Mid-level', 'Senior-level', 'Executive'];

    const clearFilters = () => {
        setSearchTerm('');
        setLocation('');
        setSelectedCategory('');
        setSelectedExperience('');
        setSelectedJobType('');
    };

    const hasActiveFilters = searchTerm || location || selectedCategory || selectedExperience || selectedJobType;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                    />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <HiSparkles className="text-yellow-500 text-2xl" />
                            </motion.div>
                            <span className="text-blue-600 font-semibold">Discover Your Dream Career</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Find Your Next{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Opportunity
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Explore thousands of job opportunities from top companies worldwide.
                            Your perfect role is waiting for you.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto"
                    >
                        {[
                            { icon: HiBriefcase, value: totalJobs.toLocaleString() + '+', label: 'Active Jobs', color: 'text-blue-600' },
                            { icon: HiUsers, value: uniqueCompanies.toLocaleString() + '+', label: 'Companies', color: 'text-purple-600' },
                            { icon: HiTrendingUp, value: newJobsThisWeek.toLocaleString() + '+', label: 'New This Week', color: 'text-green-600' }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                            >
                                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                                <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 text-sm font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Enhanced Search Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30 max-w-5xl mx-auto"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {/* Search Input */}
                            <div className="lg:col-span-2 relative">
                                <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Job title, keywords, or company..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-500"
                                />
                            </div>

                            {/* Location Input */}
                            <div className="relative">
                                <HiLocationMarker className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Advanced Filters Toggle */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            >
                                <HiAdjustments className="w-4 h-4" />
                                <span className="font-medium">Advanced Filters</span>
                                <motion.div
                                    animate={{ rotate: showAdvancedFilters ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <HiFilter className="w-4 h-4" />
                                </motion.div>
                            </motion.button>

                            {hasActiveFilters && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={clearFilters}
                                    className="text-sm px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                                >
                                    Clear All Filters
                                </motion.button>
                            )}
                        </div>

                        {/* Advanced Filters */}
                        <motion.div
                            initial={false}
                            animate={{
                                height: showAdvancedFilters ? 'auto' : 0,
                                opacity: showAdvancedFilters ? 1 : 0
                            }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-6 border-t border-gray-200 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Category Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Experience Level
                                        </label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">All Levels</option>
                                            {categories.map(category => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Experience Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Experience
                                        </label>
                                        <select
                                            value={selectedExperience}
                                            onChange={(e) => setSelectedExperience(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">Any Experience</option>
                                            {experienceLevels.map(level => (
                                                <option key={level} value={level}>
                                                    {level}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Job Type Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Type
                                        </label>
                                        <select
                                            value={selectedJobType}
                                            onChange={(e) => setSelectedJobType(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">All Types</option>
                                            {jobTypes.map(type => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>



            <Footer />
        </div>
    );
};

export default JobsPage;
