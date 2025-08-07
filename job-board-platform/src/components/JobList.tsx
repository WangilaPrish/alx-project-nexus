import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import { HiSparkles } from 'react-icons/hi';
import {
    MdChevronLeft,
    MdChevronRight,
    MdClear,
    MdFilterList,
    MdGridView,
    MdSearch,
    MdTrendingUp,
    MdViewList
} from 'react-icons/md';
import { useJobContext } from '../context/JobContext';
import JobCard from './JobCard';

type JobListProps = {
    limit?: number;
    random?: boolean;
    showIntro?: boolean;
    searchTerm?: string;
};

type SortOption = 'newest' | 'oldest' | 'company' | 'location' | 'salary';
type ViewMode = 'grid' | 'list';

const JobList = ({ limit = 0, random = false, showIntro = false, searchTerm = '' }: JobListProps) => {
    const { jobs, loading, error, currentPage, setCurrentPage, jobsPerPage } = useJobContext();
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // Advanced filtering and sorting
    const processedJobs = useMemo(() => {
        let filtered = jobs;

        // Apply search filter
        const term = (localSearchTerm || searchTerm).toLowerCase();
        if (term) {
            filtered = jobs.filter((job) =>
                [job.title, job.company, job.location, job.description].some((field) =>
                    field?.toLowerCase().includes(term)
                )
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.postedAt || 0).getTime() - new Date(a.postedAt || 0).getTime();
                case 'oldest':
                    return new Date(a.postedAt || 0).getTime() - new Date(b.postedAt || 0).getTime();
                case 'company':
                    return a.company.localeCompare(b.company);
                case 'location':
                    return a.location.localeCompare(b.location);
                case 'salary': {
                    const aSalary = parseFloat(a.salary?.replace(/[^\d.]/g, '') || '0');
                    const bSalary = parseFloat(b.salary?.replace(/[^\d.]/g, '') || '0');
                    return bSalary - aSalary;
                }
                default:
                    return 0;
            }
        });

        // Apply limit and random if specified
        if (random && limit > 0 && filtered.length >= limit) {
            filtered = [...filtered].sort(() => 0.5 - Math.random()).slice(0, limit);
        } else if (limit > 0) {
            filtered = filtered.slice(0, limit);
        }

        return filtered;
    }, [jobs, localSearchTerm, searchTerm, sortBy, random, limit]);

    // Pagination logic
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = processedJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(processedJobs.length / jobsPerPage);

    const clearSearch = useCallback(() => {
        setLocalSearchTerm('');
    }, []);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page
    }, [setCurrentPage]);

    // Loading skeleton component
    const JobSkeleton = () => (
        <div className="animate-pulse">
            <div className="bg-gray-200 rounded-lg p-6 h-64">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                </div>
                <div className="mt-4 flex justify-between">
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-300 rounded w-16"></div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <section className="py-12 px-4 sm:px-6 md:px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <JobSkeleton key={i} />
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
            >
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <h3 className="text-red-800 font-semibold mb-2">Error Loading Jobs</h3>
                    <p className="text-red-600">{error}</p>
                </div>
            </motion.div>
        );
    }

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0
        }
    };

    const pageVariants = {
        enter: { opacity: 0, x: 20 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <section className="py-12 px-4 sm:px-6 md:px-6 max-w-7xl mx-auto">
            {/* Header Section */}
            {showIntro ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                        >
                            <HiSparkles className="text-yellow-400 text-2xl" />
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Explore Fresh Job Opportunities
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            We've handpicked exciting opportunities aligned with your goals.
                        </p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Latest Job Openings</h2>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <MdTrendingUp className="text-green-500" />
                        <span>{processedJobs.length} opportunities available</span>
                    </div>
                </motion.div>
            )}

            {/* Controls Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 space-y-4"
            >
                {/* Search Bar */}
                <div className="relative max-w-md mx-auto">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={localSearchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {localSearchTerm && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <MdClear />
                        </motion.button>
                    )}
                </div>

                {/* Filters and Controls */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${showFilters
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <MdFilterList />
                            Filters
                        </motion.button>

                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex items-center gap-2"
                                >
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="company">Company A-Z</option>
                                        <option value="location">Location A-Z</option>
                                        <option value="salary">Highest Salary</option>
                                    </select>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition ${viewMode === 'grid'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <MdGridView />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition ${viewMode === 'list'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <MdViewList />
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Jobs Grid/List */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${viewMode}-${currentPage}`}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'space-y-4'
                        }
                    >
                        {currentJobs.length > 0 ? (
                            currentJobs.map((job) => (
                                <motion.div
                                    key={job.id}
                                    variants={cardVariants}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className={viewMode === 'list' ? 'max-w-none' : ''}
                                >
                                    <JobCard job={job} />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="col-span-full text-center py-16"
                            >
                                <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                                    <MdSearch className="text-gray-400 text-4xl mx-auto mb-4" />
                                    <h3 className="text-gray-600 font-semibold mb-2">No Jobs Found</h3>
                                    <p className="text-gray-500 text-sm">
                                        Try adjusting your search criteria or filters.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Advanced Pagination */}
            {totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center items-center mt-12 space-x-2"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdChevronLeft />
                    </motion.button>

                    <div className="flex space-x-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-4 py-2 rounded-lg border transition ${currentPage === pageNum
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNum}
                                </motion.button>
                            );
                        })}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdChevronRight />
                    </motion.button>

                    <div className="ml-4 text-sm text-gray-500">
                        Page {currentPage} of {totalPages}
                    </div>
                </motion.div>
            )}
        </section>
    );
};

export default JobList;
