import { useJobContext } from '../context/JobContext';
import JobCard from './JobCard';

const JobList = () => {
    const { jobs, loading, error } = useJobContext();

    if (loading) return <p className="text-center text-gray-500 py-8">Loading jobs...</p>;
    if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

    return (
        <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Latest Job Openings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length > 0 ? (
                    jobs.map((job) => <JobCard key={job.id} job={job} />)
                ) : (
                    <p className="col-span-full text-center text-gray-500">No jobs found.</p>
                )}
            </div>
        </section>
    );
};

export default JobList;
