import React, { useEffect, useState } from 'react';
import {
    FaBuilding,
    FaClock,
    FaDollarSign,
    FaExternalLinkAlt,
    FaHeart,
    FaMapMarkerAlt,
    FaRegHeart,
    FaSearch,
    FaSpinner
} from 'react-icons/fa';
import { useExternalAuth, useExternalJobs, useExternalSavedJobs } from '../hooks/useExternalJobs';
import type { ExternalJob } from '../services/externalJobsService';
import { externalJobsService } from '../services/externalJobsService';

// Job Type Mapping
const jobTypeMap = {
    'FT': 'Full-time',
    'PT': 'Part-time',
    'CT': 'Contract',
    'IN': 'Internship',
    'FR': 'Freelance'
};

const ExternalJobsExplorer: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState<ExternalJob | null>(null);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [applying, setApplying] = useState(false);

    const {
        jobs,
        loading: jobsLoading,
        error: jobsError,
        searchJobs,
        loadMore,
        hasMore,
        refresh: refreshJobs
    } = useExternalJobs();

    const {
        savedJobs,
        saveJob,
        removeSavedJob,
        isJobSaved,
        loading: savedJobsLoading
    } = useExternalSavedJobs();

    const { isAuthenticated: isExternalAuthenticated } = useExternalAuth();

    // Load initial jobs
    useEffect(() => {
        refreshJobs();
    }, [refreshJobs]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            searchJobs(searchTerm);
        } else {
            refreshJobs();
        }
    };

    const handleJobDetails = async (job: ExternalJob) => {
        setSelectedJob(job);
    };

    const handleSaveJob = async (jobId: number) => {
        if (!isExternalAuthenticated) {
            alert('Please login to the external job board to save jobs');
            return;
        }

        const result = await saveJob(jobId);
        if (result.success) {
            alert(result.message);
        } else {
            alert(result.message);
        }
    };

    const handleRemoveSavedJob = async (jobId: number) => {
        const savedJob = savedJobs.find(sj => sj.job === jobId);
        if (savedJob) {
            const result = await removeSavedJob(savedJob.id.toString());
            if (result.success) {
                alert(result.message);
            } else {
                alert(result.message);
            }
        }
    };

    const handleApplyToJob = async () => {
        if (!selectedJob || !coverLetter.trim()) return;

        setApplying(true);
        try {
            const result = await externalJobsService.applyToJob(selectedJob.id, {
                cover_letter: coverLetter
            });

            if (result.success) {
                alert(result.message);
                setShowApplicationModal(false);
                setCoverLetter('');
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Application error:', error);
            alert('Failed to apply to job. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">
                    External Job Board Explorer
                </h1>
                <p className="text-gray-600 mb-6">
                    Discover jobs from external job boards integrated into your platform
                </p>

                {/* Authentication Status */}
                <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-700">
                        External API Status: {isExternalAuthenticated ? (
                            <span className="text-green-600 font-semibold">✓ Connected</span>
                        ) : (
                            <span className="text-orange-600 font-semibold">⚠ Not Connected (some features limited)</span>
                        )}
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search external jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={jobsLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {jobsLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                        Search
                    </button>
                </form>
            </div>

            {/* Error Display */}
            {jobsError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">Error: {jobsError}</p>
                </div>
            )}

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                        <div className="p-6">
                            {/* Job Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                                        {job.title}
                                    </h3>
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <FaBuilding className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{job.company_name}</span>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={() => isJobSaved(job.id) ? handleRemoveSavedJob(job.id) : handleSaveJob(job.id)}
                                    disabled={savedJobsLoading}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title={isJobSaved(job.id) ? 'Remove from saved' : 'Save job'}
                                >
                                    {isJobSaved(job.id) ? (
                                        <FaHeart className="w-5 h-5 text-red-500" />
                                    ) : (
                                        <FaRegHeart className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            {/* Job Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-gray-600">
                                    <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{job.location}</span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <FaDollarSign className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{job.salary}</span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <FaClock className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{jobTypeMap[job.job_type]}</span>
                                </div>
                            </div>

                            {/* Job Category & Industry */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    {job.category_name}
                                </span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    {job.industry}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-full ${job.status === 'OPEN'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {job.status}
                                </span>
                            </div>

                            {/* Description Preview */}
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {job.description}
                            </p>

                            {/* Posted Date */}
                            <p className="text-xs text-gray-500 mb-4">
                                Posted: {formatDate(job.posted_at)}
                                {job.expires_at && ` • Expires: ${formatDate(job.expires_at)}`}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleJobDetails(job)}
                                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    View Details
                                </button>

                                {isExternalAuthenticated && job.status === 'OPEN' && (
                                    <button
                                        onClick={() => {
                                            setSelectedJob(job);
                                            setShowApplicationModal(true);
                                        }}
                                        className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-1"
                                    >
                                        Apply <FaExternalLinkAlt className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="text-center mt-8">
                    <button
                        onClick={loadMore}
                        disabled={jobsLoading}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {jobsLoading ? 'Loading...' : 'Load More Jobs'}
                    </button>
                </div>
            )}

            {/* Job Details Modal */}
            {selectedJob && !showApplicationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {selectedJob.title}
                                </h2>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="text-gray-400 hover:text-gray-600 text-xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Company</h3>
                                    <p>{selectedJob.company_name}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Location</h3>
                                    <p>{selectedJob.location}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Salary</h3>
                                    <p>{selectedJob.salary}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Job Type</h3>
                                    <p>{jobTypeMap[selectedJob.job_type]}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                                    <div className="prose text-gray-600 whitespace-pre-wrap">
                                        {selectedJob.description}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Industry</h3>
                                    <p>{selectedJob.industry}</p>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Posted: {formatDate(selectedJob.posted_at)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Views: {selectedJob.view_count}
                                        </p>
                                    </div>

                                    {isExternalAuthenticated && selectedJob.status === 'OPEN' && (
                                        <button
                                            onClick={() => setShowApplicationModal(true)}
                                            className="py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                        >
                                            Apply Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Application Modal */}
            {showApplicationModal && selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Apply to {selectedJob.title}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowApplicationModal(false);
                                        setCoverLetter('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600 text-xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cover Letter *
                                    </label>
                                    <textarea
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        placeholder="Write a brief cover letter for this position..."
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowApplicationModal(false);
                                            setCoverLetter('');
                                        }}
                                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleApplyToJob}
                                        disabled={applying || !coverLetter.trim()}
                                        className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {applying ? 'Applying...' : 'Submit Application'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExternalJobsExplorer;
