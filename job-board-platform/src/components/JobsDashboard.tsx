import React, { useCallback, useEffect, useState } from 'react';
import { FaDollarSign, FaExternalLinkAlt, FaHome, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useExternalJobs } from '../hooks/useExternalJobs';
import type { ExternalJob } from '../services/externalJobsService';
import { fetchJobs } from '../services/jobService';
import type { Job } from '../types';

interface CombinedJob {
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    type?: string;
    isExternal: boolean;
    source: 'internal' | 'external';
    originalData: Job | ExternalJob;
}

const JobsDashboard: React.FC = () => {
    const [combinedJobs, setCombinedJobs] = useState<CombinedJob[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'internal' | 'external'>('all');

    const { jobs: externalJobs, loading: externalLoading } = useExternalJobs();

    const loadJobs = useCallback(async () => {
        setLoading(true);
        try {
            // Load internal jobs
            const internalJobs: Job[] = await fetchJobs();

            // Convert internal jobs to combined format
            const internalCombined: CombinedJob[] = internalJobs.map(job => ({
                id: `internal_${job.id}`,
                title: job.title,
                company: job.company,
                location: job.location,
                salary: job.salary,
                type: job.type,
                isExternal: false,
                source: 'internal' as const,
                originalData: job
            }));

            // Convert external jobs to combined format
            const externalCombined: CombinedJob[] = externalJobs.map(job => ({
                id: `external_${job.id}`,
                title: job.title,
                company: job.company_name,
                location: job.location,
                salary: job.salary,
                type: job.job_type,
                isExternal: true,
                source: 'external' as const,
                originalData: job
            }));

            // Combine and shuffle for variety
            const allJobs = [...internalCombined, ...externalCombined];
            setCombinedJobs(allJobs.sort(() => Math.random() - 0.5));

        } catch (error) {
            console.error('Error loading jobs:', error);
        } finally {
            setLoading(false);
        }
    }, [externalJobs]);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    const filteredJobs = combinedJobs.filter(job => {
        if (filter === 'all') return true;
        return job.source === filter;
    });

    const getJobTypeDisplay = (type?: string) => {
        const typeMap: Record<string, string> = {
            'FT': 'Full-time',
            'PT': 'Part-time',
            'CT': 'Contract',
            'IN': 'Internship',
            'FR': 'Freelance',
            'full-time': 'Full-time',
            'part-time': 'Part-time',
            'contract': 'Contract',
            'internship': 'Internship'
        };
        return typeMap[type || ''] || type || 'Not specified';
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    All Available Jobs
                </h1>
                <p className="text-gray-600 mb-6">
                    Discover opportunities from both our platform and external job boards
                </p>

                {/* Filter Buttons */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        All Jobs ({combinedJobs.length})
                    </button>
                    <button
                        onClick={() => setFilter('internal')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'internal'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <FaHome className="inline w-4 h-4 mr-1" />
                        Internal ({combinedJobs.filter(j => j.source === 'internal').length})
                    </button>
                    <button
                        onClick={() => setFilter('external')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'external'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <FaExternalLinkAlt className="inline w-4 h-4 mr-1" />
                        External ({combinedJobs.filter(j => j.source === 'external').length})
                    </button>
                </div>

                {/* Quick Access Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <Link
                        to="/jobs"
                        className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <FaHome className="text-green-600 text-xl" />
                            <div>
                                <h3 className="font-semibold text-green-800">Internal Job Board</h3>
                                <p className="text-sm text-green-600">Browse jobs from our platform</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/external-jobs"
                        className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <FaExternalLinkAlt className="text-purple-600 text-xl" />
                            <div>
                                <h3 className="font-semibold text-purple-800">External Job Explorer</h3>
                                <p className="text-sm text-purple-600">Discover jobs from external sources</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Loading State */}
            {(loading || externalLoading) && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 mt-2">Loading jobs...</p>
                </div>
            )}

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                    <div
                        key={job.id}
                        className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 ${job.isExternal
                                ? 'border-l-purple-500'
                                : 'border-l-green-500'
                            }`}
                    >
                        <div className="p-6">
                            {/* Job Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                                        {job.title}
                                    </h3>
                                    <p className="text-gray-600">{job.company}</p>
                                </div>

                                {/* Source Badge */}
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${job.isExternal
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                    {job.isExternal ? (
                                        <>
                                            <FaExternalLinkAlt className="inline w-3 h-3 mr-1" />
                                            External
                                        </>
                                    ) : (
                                        <>
                                            <FaHome className="inline w-3 h-3 mr-1" />
                                            Internal
                                        </>
                                    )}
                                </span>
                            </div>

                            {/* Job Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-gray-600">
                                    <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{job.location}</span>
                                </div>

                                {job.salary && (
                                    <div className="flex items-center text-gray-600">
                                        <FaDollarSign className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{job.salary}</span>
                                    </div>
                                )}

                                {job.type && (
                                    <div className="text-sm text-gray-600">
                                        {getJobTypeDisplay(job.type)}
                                    </div>
                                )}
                            </div>

                            {/* Action Button */}
                            <div className="mt-4">
                                {job.isExternal ? (
                                    <Link
                                        to="/external-jobs"
                                        className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium text-center block"
                                    >
                                        View on External Board
                                    </Link>
                                ) : (
                                    <Link
                                        to="/jobs"
                                        className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium text-center block"
                                    >
                                        View Details
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {!loading && !externalLoading && filteredJobs.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📄</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
                    <p className="text-gray-500">
                        {filter === 'all'
                            ? 'No jobs are currently available.'
                            : `No ${filter} jobs are currently available.`
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default JobsDashboard;
