import { Link } from 'react-router-dom';
import type { Job } from './../../src/types';

const JobCard = ({ job }: { job: Job }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                {job.type && (
                    <span className="text-sm px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        {job.type}
                    </span>
                )}
            </div>

            {job.company && (
                <p className="text-gray-600 text-sm mb-1">{job.company}</p>
            )}

            {job.location && (
                <p className="text-gray-500 text-sm mb-1">{job.location}</p>
            )}

            {job.salary && (
                <p className="text-gray-700 text-sm mb-2">💰 {job.salary}</p>
            )}

            {job.postedAt && (
                <p className="text-gray-400 text-xs mb-2">
                    Posted: {new Date(job.postedAt).toDateString()}
                </p>
            )}

            {job.description && (
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {job.description}
                </p>
            )}

            <div className="mt-4 flex justify-between items-center">
                {job.experienceLevel && (
                    <span className="text-sm text-gray-400">{job.experienceLevel}</span>
                )}

                {job.applyLink ? (
                    <a
                        href={job.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm font-medium"
                    >
                        Apply Now
                    </a>
                ) : null}
            </div>
        </div>
    );
};

export default JobCard;
