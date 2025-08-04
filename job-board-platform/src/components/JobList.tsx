import JobCard from './JobCard';
import { useJobContext } from '../context/JobContext';

interface JobListProps {
    limit?: number;
    random?: boolean;
}

const JobList = ({ limit = 0, random = false }: JobListProps) => {
    const { jobs, loading, error } = useJobContext();

    if (loading) {
        return <p className="text-center text-gray-500 py-8">Loading jobs...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 py-8">{error}</p>;
    }

    let displayedJobs = jobs;

    if (random && limit > 0 && jobs.length >= limit) {
        // Shuffle and pick 'limit' jobs
        displayedJobs = [...jobs].sort(() => 0.5 - Math.random()).slice(0, limit);
    } else if (limit > 0) {
        displayedJobs = jobs.slice(0, limit);
    }

    return (
        <section className="py-16 px-4 sm:px-6 md:px-6 max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Latest Job Openings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(displayedJobs) && displayedJobs.length > 0 ? (
                    displayedJobs.map((job) => (
                        <JobCard key={job.id ?? `${job.title}-${job.company}`} job={job} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No jobs available at the moment.
                    </p>
                )}
            </div>
        </section>
    );
};

export default JobList;
