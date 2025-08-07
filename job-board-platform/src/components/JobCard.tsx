import { useState } from 'react';
import { HiCheck, HiExternalLink } from 'react-icons/hi';
import { useAppliedJobs } from '../context/AppliedJobsContext';
import { useAuth } from '../context/AuthContext';
import type { Job } from '../types';

const JobCard = ({ job }: { job: Job }) => {
    const { appliedJobs, applyToJob } = useAppliedJobs();
    const { user } = useAuth();
    const [isApplying, setIsApplying] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const isApplied = appliedJobs.some(appliedJob => appliedJob.jobId === job.id);

    const handleApply = async () => {
        if (!user) {
            alert('Please sign in to apply for jobs');
            return;
        }

        if (isApplied) {
            return;
        }

        try {
            setIsApplying(true);
            await applyToJob(job, job.applyLink);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to apply to job');
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <div className="flex flex-col justify-between h-full p-6 bg-white rounded-lg shadow border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                {job.type && (
                    <span
                        className="text-sm px-2 py-1 bg-blue-100 text-blue-600 rounded"
                    >
                        {job.type}
                    </span>
                )}
            </div>

            {job.company && <p className="text-gray-600 text-sm mb-1">{job.company}</p>}
            {job.location && <p className="text-gray-500 text-sm mb-1">{job.location}</p>}
            {job.salary && <p className="text-gray-700 text-sm mb-2">💰 {job.salary}</p>}
            {job.postedAt && (
                <p className="text-gray-400 text-xs mb-2">Posted: {new Date(job.postedAt).toDateString()}</p>
            )}
            {job.description && (
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{job.description}</p>
            )}

            <div className="mt-4 flex justify-between items-center">
                {job.experienceLevel && (
                    <span className="text-sm text-gray-400">{job.experienceLevel}</span>
                )}

                <div className="flex gap-2">
                    {job.applyLink && (
                        <a
                            href={job.applyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:scale-105 text-sm font-medium flex items-center gap-1 transition-all duration-200"
                            title="Apply on external website"
                        >
                            <HiExternalLink className="w-3 h-3" />
                            External
                        </a>
                    )}

                    <button
                        onClick={handleApply}
                        disabled={isApplying || isApplied}
                        className={`text-sm font-medium px-3 py-1 rounded transition-all duration-200 flex items-center gap-1 hover:scale-105 ${isApplied
                                ? 'bg-green-100 text-green-700 cursor-default'
                                : showSuccess
                                    ? 'bg-green-500 text-white'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {isApplying ? (
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                        ) : showSuccess || isApplied ? (
                            <>
                                <HiCheck className="w-3 h-3" />
                                Applied
                            </>
                        ) : (
                            'Apply'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
