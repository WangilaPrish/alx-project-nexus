import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import {
    HiCalendar,
    HiChartBar,
    HiCheckCircle,
    HiClock,
    HiExclamation,
    HiExternalLink,
    HiEye,
    HiLocationMarker,
    HiOfficeBuilding,
    HiPlus,
    HiSearch,
    HiSortAscending,
    HiSortDescending,
    HiSparkles,
    HiTrash,
    HiTrendingUp,
    HiXCircle
} from 'react-icons/hi';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/NavBar';
import { useAppliedJobs } from '../context/AppliedJobsContext';
import { useAuth } from '../context/AuthContext';
import type { AppliedJob, Job } from '../types';

const AppliedJobsPage = () => {
    const { appliedJobs, loading, error, updateApplicationStatus, removeApplication, addExternalApplication } = useAppliedJobs();
    const { user } = useAuth();
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'company' | 'status'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [newJob, setNewJob] = useState<Partial<Job>>({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        experienceLevel: 'Mid-level'
    });
    const [externalUrl, setExternalUrl] = useState('');
    const [notes, setNotes] = useState('');

    // Enhanced filtering and sorting
    const filteredAndSortedJobs = useMemo(() => {
        let filtered = appliedJobs;

        // Filter by status
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(job => job.applicationStatus === selectedStatus);
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(job =>
                job.job.title.toLowerCase().includes(term) ||
                job.job.company.toLowerCase().includes(term) ||
                job.job.location.toLowerCase().includes(term)
            );
        }

        // Sort jobs
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
                    break;
                case 'company':
                    comparison = a.job.company.localeCompare(b.job.company);
                    break;
                case 'status':
                    comparison = a.applicationStatus.localeCompare(b.applicationStatus);
                    break;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [appliedJobs, selectedStatus, searchTerm, sortBy, sortOrder]);

    // Statistics
    const stats = useMemo(() => {
        const total = appliedJobs.length;
        const thisWeek = appliedJobs.filter(job => {
            const appliedDate = new Date(job.appliedAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return appliedDate >= weekAgo;
        }).length;

        const statusCounts = appliedJobs.reduce((acc, job) => {
            acc[job.applicationStatus] = (acc[job.applicationStatus] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const responseRate = total > 0 ?
            Math.round(((statusCounts.interviewed || 0) + (statusCounts.accepted || 0)) / total * 100) : 0;

        return {
            total,
            thisWeek,
            responseRate,
            statusCounts
        };
    }, [appliedJobs]);

    const statusColors = {
        applied: 'bg-blue-100 text-blue-800',
        viewed: 'bg-yellow-100 text-yellow-800',
        interviewed: 'bg-purple-100 text-purple-800',
        rejected: 'bg-red-100 text-red-800',
        accepted: 'bg-green-100 text-green-800'
    };

    const handleStatusUpdate = async (applicationId: string, newStatus: AppliedJob['applicationStatus']) => {
        try {
            await updateApplicationStatus(applicationId, newStatus);
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleRemoveApplication = async (applicationId: string) => {
        if (window.confirm('Are you sure you want to remove this application?')) {
            try {
                await removeApplication(applicationId);
            } catch (err) {
                console.error('Failed to remove application:', err);
            }
        }
    };

    const handleAddExternalJob = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newJob.title || !newJob.company || !externalUrl) return;

        try {
            const jobToAdd: Job = {
                id: `external_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: newJob.title || '',
                company: newJob.company || '',
                location: newJob.location || 'Remote',
                type: newJob.type || 'Full-time',
                experienceLevel: newJob.experienceLevel || 'Mid-level',
                description: `Applied externally via ${externalUrl}`,
                applyLink: externalUrl
            };

            await addExternalApplication(jobToAdd, externalUrl, notes);

            // Reset form
            setNewJob({
                title: '',
                company: '',
                location: '',
                type: 'Full-time',
                experienceLevel: 'Mid-level'
            });
            setExternalUrl('');
            setNotes('');
            setShowAddForm(false);
        } catch (err) {
            console.error('Failed to add external job:', err);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
                <Navbar />
                <div className="pt-24 flex items-center justify-center min-h-screen">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="mb-6"
                        >
                            <HiSparkles className="text-blue-500 text-4xl mx-auto" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Sign In</h1>
                        <p className="text-gray-600 mb-6">You need to be signed in to view your applied jobs.</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                            onClick={() => window.location.href = '/login'}
                        >
                            Sign In to Continue
                        </motion.button>
                    </motion.div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">

            {/* Hero Section */}
            <section className="relative pt-24 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
                    />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >


                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                My Applied{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Jobs
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Track all your job applications, including those applied on external websites
                        </p>
                    </motion.div>

                    {/* Statistics Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                    >
                        {[
                            {
                                icon: HiOfficeBuilding,
                                value: stats.total.toString(),
                                label: 'Total Applications',
                                color: 'text-blue-600',
                                bgColor: 'bg-blue-100'
                            },
                            {
                                icon: HiClock,
                                value: stats.thisWeek.toString(),
                                label: 'This Week',
                                color: 'text-green-600',
                                bgColor: 'bg-green-100'
                            },
                            {
                                icon: HiTrendingUp,
                                value: `${stats.responseRate}%`,
                                label: 'Response Rate',
                                color: 'text-purple-600',
                                bgColor: 'bg-purple-100'
                            },
                            {
                                icon: HiChartBar,
                                value: (stats.statusCounts.interviewed || 0).toString(),
                                label: 'Interviews',
                                color: 'text-orange-600',
                                bgColor: 'bg-orange-100'
                            }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                            >
                                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 text-sm font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="px-4 sm:px-6 lg:px-8 pb-12">
                <div className="max-w-7xl mx-auto">
                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8"
                    >
                        {/* Search and Filter Bar */}
                        <div className="flex flex-col lg:flex-row gap-4 mb-6">
                            {/* Search Input */}
                            <div className="flex-1 relative">
                                <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search applications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Sort Controls */}
                            <div className="flex gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'date' | 'company' | 'status')}
                                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="date">Sort by Date</option>
                                    <option value="company">Sort by Company</option>
                                    <option value="status">Sort by Status</option>
                                </select>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    {sortOrder === 'asc' ? <HiSortAscending className="w-5 h-5" /> : <HiSortDescending className="w-5 h-5" />}
                                </motion.button>
                            </div>

                            {/* Add Application Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowAddForm(true)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
                            >
                                <HiPlus className="w-4 h-4" />
                                Add Application
                            </motion.button>
                        </div>

                        {/* Status Filter Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {[
                                { key: 'all', label: 'All Applications', icon: HiOfficeBuilding },
                                { key: 'applied', label: 'Applied', icon: HiClock },
                                { key: 'viewed', label: 'Viewed', icon: HiEye },
                                { key: 'interviewed', label: 'Interviewed', icon: HiExclamation },
                                { key: 'rejected', label: 'Rejected', icon: HiXCircle },
                                { key: 'accepted', label: 'Accepted', icon: HiCheckCircle }
                            ].map(status => (
                                <motion.button
                                    key={status.key}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedStatus(status.key)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedStatus === status.key
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <status.icon className="w-4 h-4" />
                                    {status.label}
                                    {status.key !== 'all' && stats.statusCounts[status.key] && (
                                        <span className={`px-2 py-1 rounded-full text-xs ${selectedStatus === status.key
                                            ? 'bg-white/20 text-white'
                                            : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {stats.statusCounts[status.key]}
                                        </span>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Add External Job Form */}
                    <AnimatePresence>
                        {showAddForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                        <HiPlus className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Add External Job Application</h3>
                                </div>

                                <form onSubmit={handleAddExternalJob} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Job Title *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter job title"
                                                value={newJob.title}
                                                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Company *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter company name"
                                                value={newJob.company}
                                                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter location"
                                                value={newJob.location}
                                                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Job Type
                                            </label>
                                            <select
                                                value={newJob.type}
                                                onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            >
                                                <option value="Full-time">Full-time</option>
                                                <option value="Part-time">Part-time</option>
                                                <option value="Contract">Contract</option>
                                                <option value="Internship">Internship</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            External Application URL *
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://company.com/careers/job-id"
                                            value={externalUrl}
                                            onChange={(e) => setExternalUrl(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notes (Optional)
                                        </label>
                                        <textarea
                                            placeholder="Add any notes about this application..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                            rows={4}
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                                        >
                                            Add Application
                                        </motion.button>

                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setShowAddForm(false)}
                                            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading State */}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full opacity-20"
                                />
                            </div>
                            <p className="text-lg text-gray-600 font-medium">Loading your applications...</p>
                        </motion.div>
                    )}

                    {/* Error State */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8"
                        >
                            <div className="flex items-center gap-3">
                                <HiXCircle className="text-red-500 text-2xl" />
                                <div>
                                    <h3 className="text-red-800 font-semibold">Error Loading Applications</h3>
                                    <p className="text-red-600">{error}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Applied Jobs List */}
                    {!loading && filteredAndSortedJobs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16"
                        >
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-gray-400 mb-6"
                                >
                                    <HiOfficeBuilding className="w-20 h-20 mx-auto" />
                                </motion.div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Applications Found</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {selectedStatus === 'all'
                                        ? "You haven't applied to any jobs yet. Start your job search journey!"
                                        : `No applications with status: ${selectedStatus}`
                                    }
                                </p>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowAddForm(true)}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                                >
                                    Add Your First Application
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {filteredAndSortedJobs.map((appliedJob, index) => (
                                <motion.div
                                    key={appliedJob.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -2, scale: 1.01 }}
                                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                                    {appliedJob.job.company[0]}
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                        {appliedJob.job.title}
                                                    </h3>

                                                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                                                        <span className="flex items-center gap-2">
                                                            <HiOfficeBuilding className="w-5 h-5 text-blue-500" />
                                                            <span className="font-medium">{appliedJob.job.company}</span>
                                                        </span>

                                                        <span className="flex items-center gap-2">
                                                            <HiLocationMarker className="w-5 h-5 text-green-500" />
                                                            <span>{appliedJob.job.location}</span>
                                                        </span>

                                                        <span className="flex items-center gap-2">
                                                            <HiCalendar className="w-5 h-5 text-purple-500" />
                                                            <span>Applied {new Date(appliedJob.appliedAt).toLocaleDateString()}</span>
                                                        </span>
                                                    </div>

                                                    {appliedJob.externalUrl && (
                                                        <motion.a
                                                            whileHover={{ scale: 1.02 }}
                                                            href={appliedJob.externalUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4 bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                                                        >
                                                            <HiExternalLink className="w-4 h-4" />
                                                            View External Application
                                                        </motion.a>
                                                    )}

                                                    {appliedJob.notes && (
                                                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                                            <p className="text-gray-700">
                                                                <span className="font-semibold text-gray-900">Notes:</span> {appliedJob.notes}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <select
                                                value={appliedJob.applicationStatus}
                                                onChange={(e) => handleStatusUpdate(appliedJob.id, e.target.value as AppliedJob['applicationStatus'])}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all cursor-pointer ${statusColors[appliedJob.applicationStatus]}`}
                                            >
                                                <option value="applied">Applied</option>
                                                <option value="viewed">Viewed</option>
                                                <option value="interviewed">Interviewed</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="accepted">Accepted</option>
                                            </select>

                                            <motion.button
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleRemoveApplication(appliedJob.id)}
                                                className="w-10 h-10 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center text-red-500 hover:text-red-700 transition-colors"
                                                title="Remove application"
                                            >
                                                <HiTrash className="w-5 h-5" />
                                            </motion.button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <span className="px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg">
                                            {appliedJob.job.type}
                                        </span>
                                        <span className="px-3 py-2 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg">
                                            {appliedJob.job.experienceLevel}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
};

export default AppliedJobsPage;
