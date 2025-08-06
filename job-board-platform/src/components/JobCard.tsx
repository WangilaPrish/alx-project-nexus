import { motion } from 'framer-motion';
import type { Job } from '../types';

const JobCard = ({ job }: { job: Job }) => {
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
                {job.applyLink && (
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={job.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm font-medium"
                    >
                        Apply Now
                    </motion.a>
                )}
            </div>
        </motion.div>
    );
};

export default JobCard;
