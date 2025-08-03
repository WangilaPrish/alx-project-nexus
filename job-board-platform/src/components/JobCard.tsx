import { Link } from 'react-router-dom';
import type { Job } from './../../src/types';

const JobCard = ({ job }: { job: Job }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                <span className="text-sm px-2 py-1 bg-blue-100 text-blue-600 rounded">{job.type}</span>
            </div>

            <p className="text-gray-600 text-sm mb-2">{job.company}</p>
            <p className="text-gray-500 text-sm">{job.location}</p>

            <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-400">{job.experienceLevel}</span>
                <Link
                    to={`/jobs/${job.id}`}
                    className="text-blue-600 hover:underline text-sm font-medium"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
