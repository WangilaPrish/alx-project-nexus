import { motion } from 'framer-motion';
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
        <motion.div
            whileHover={{ y: -5, boxShadow: '0px 10px 20px rgba(0,0,0,0.05)' }}
            transition={{ type: 'spring', stiffness: 150 }}
            className="flex flex-col justify-between h-full p-6 bg-white rounded-lg shadow border transition"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                {job.type && (
                    <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="text-sm px-2 py-1 bg-blue-100 text-blue-600 rounded"
                    >
                        {job.type}
                    </motion.span>
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
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={job.applyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                            title="Apply on external website"
                        >
                            <HiExternalLink className="w-3 h-3" />
                            External
                        </motion.a>
                    )}

                    <motion.button
                        whileHover={{ scale: isApplied ? 1 : 1.05 }}
                        whileTap={{ scale: isApplied ? 1 : 0.95 }}
                        onClick={handleApply}
                        disabled={isApplying || isApplied}
                        className={`text-sm font-medium px-3 py-1 rounded transition flex items-center gap-1 ${isApplied
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
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default JobCard;
