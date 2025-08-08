import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import {
    HiAdjustments,
    HiBriefcase,
    HiFilter,
    HiLocationMarker,
    HiSearch,
    HiTrendingUp,
    HiUsers
} from 'react-icons/hi';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { useJobContext } from '../context/JobContext';

const JobsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { jobs, setFilters, filteredJobs } = useJobContext();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [location, setLocation] = useState(searchParams.get('location') || '');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedExperience, setSelectedExperience] = useState(searchParams.get('experience') || '');
    const [selectedJobType, setSelectedJobType] = useState(searchParams.get('type') || '');
    const [selectedCompany, setSelectedCompany] = useState(searchParams.get('company') || '');
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
    const [jobsPerPage] = useState(9); // Show 9 jobs per page

    // Update JobContext filters when local filters change
    useEffect(() => {
        setFilters({
            category: selectedCategory,
            location: location,
            experience: selectedExperience
        });
    }, [selectedCategory, location, selectedExperience, setFilters]);

    // Additional filtering for searchTerm, jobType, and company (not handled by JobContext)
    const finalFilteredJobs = useMemo(() => {
        let jobs = filteredJobs;

        // Apply search term filter
        if (searchTerm) {
            jobs = jobs.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply job type filter
        if (selectedJobType) {
            jobs = jobs.filter(job =>
                job.type.toLowerCase().includes(selectedJobType.toLowerCase())
            );
        }

        // Apply company filter
        if (selectedCompany) {
            jobs = jobs.filter(job =>
                job.company.toLowerCase().includes(selectedCompany.toLowerCase())
            );
        }

        return jobs;
    }, [filteredJobs, searchTerm, selectedJobType, selectedCompany]);

    // Pagination logic
    const totalPages = Math.ceil(finalFilteredJobs.length / jobsPerPage);
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const currentJobs = finalFilteredJobs.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, location, selectedCategory, selectedExperience, selectedJobType, selectedCompany]);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (location) params.set('location', location);
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedExperience) params.set('experience', selectedExperience);
        if (selectedJobType) params.set('type', selectedJobType);
        if (selectedCompany) params.set('company', selectedCompany);
        if (currentPage > 1) params.set('page', currentPage.toString());

        setSearchParams(params, { replace: true });
    }, [searchTerm, location, selectedCategory, selectedExperience, selectedJobType, selectedCompany, currentPage, setSearchParams]);

    // Job statistics
    const totalJobs = finalFilteredJobs.length;
    const newJobsThisWeek = finalFilteredJobs.filter(job => {
        const jobDate = new Date(job.postedAt || '');
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return jobDate >= weekAgo;
    }).length;

    const uniqueCompanies = new Set(finalFilteredJobs.map(job => job.company)).size;

    // Filter options based on actual job data
    const jobTitles = Array.from(new Set(jobs.map(job => job.title))).filter(Boolean).sort();
    const jobTypes = Array.from(new Set(jobs.map(job => job.type))).filter(Boolean).sort();
    const experienceLevels = Array.from(new Set(jobs.map(job => job.experienceLevel))).filter(Boolean).sort();
    const companies = Array.from(new Set(jobs.map(job => job.company))).filter(Boolean).sort();

    const clearFilters = () => {
        setSearchTerm('');
        setLocation('');
        setSelectedCategory('');
        setSelectedExperience('');
        setSelectedJobType('');
        setSelectedCompany('');
        setCurrentPage(1);
    };

    const hasActiveFilters = searchTerm || location || selectedCategory || selectedExperience || selectedJobType || selectedCompany;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">

            {/* Hero Section */}
            <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Elements - Simplified static gradients */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-8"
                    >


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
                            <button
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all"
                            >
                                <HiAdjustments className="w-4 h-4" />
                                <span className="font-medium">Advanced Filters</span>
                                <motion.div
                                    animate={{ rotate: showAdvancedFilters ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <HiFilter className="w-4 h-4" />
                                </motion.div>
                            </button>

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm px-4 py-2 text-red-600 hover:bg-red-50 hover:scale-105 rounded-xl transition-all duration-200 font-medium"
                                >
                                    Clear All Filters
                                </button>
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
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Job Category Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Title
                                        </label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">All Job Titles</option>
                                            {jobTitles.map(title => (
                                                <option key={title} value={title}>
                                                    {title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Experience Level Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Experience Level
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

                                    {/* Company Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company
                                        </label>
                                        <select
                                            value={selectedCompany}
                                            onChange={(e) => setSelectedCompany(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">All Companies</option>
                                            {companies.map(company => (
                                                <option key={company} value={company}>
                                                    {company}
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

            {/* Job Listings Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Results Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {finalFilteredJobs.length === 0
                                    ? 'No jobs found'
                                    : `${finalFilteredJobs.length} job${finalFilteredJobs.length !== 1 ? 's' : ''} found`
                                }
                            </h2>
                            {hasActiveFilters && (
                                <p className="text-gray-600">
                                    Showing results matching your search criteria
                                </p>
                            )}
                            {finalFilteredJobs.length > 0 && totalPages > 1 && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, finalFilteredJobs.length)} of {finalFilteredJobs.length} jobs
                                </p>
                            )}
                        </div>

                        {finalFilteredJobs.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>Sort by:</span>
                                <select className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                                    <option>Most Recent</option>
                                    <option>Most Relevant</option>
                                    <option>Company A-Z</option>
                                </select>
                            </div>
                        )}
                    </motion.div>

                    {/* Job Results */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                    >
                        {finalFilteredJobs.length === 0 ? (
                            /* Empty State */
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <HiBriefcase className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            /* Job Cards Grid */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentJobs.map((job, index) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="h-full"
                                    >
                                        <JobCard job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {finalFilteredJobs.length > 0 && totalPages > 1 && (
                            <div className="flex justify-center items-center mt-12 gap-2">
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ← Previous
                                </motion.button>

                                <div className="flex items-center gap-1">
                                    {/* Page Numbers */}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <motion.button
                                                key={pageNum}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 1.3 + i * 0.1 }}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${currentPage === pageNum
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                                                    }`}
                                            >
                                                {pageNum}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next →
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default JobsPage;
