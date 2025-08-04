import JobCard from './JobCard';
import { useJobContext } from '../context/JobContext';

interface JobListProps {
    limit?: number;
    random?: boolean;
    showIntro?: boolean;
    searchTerm?: string;
}

const JobList = ({ limit = 0, random = false, showIntro = false, searchTerm = '' }: JobListProps) => {
    const { jobs, loading, error } = useJobContext();

    if (loading) {
        return <p className="text-center text-gray-500 py-8">Loading jobs...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 py-8">{error}</p>;
    }

    // Filter based on search term (if provided)
    let filteredJobs = jobs;
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredJobs = jobs.filter((job) =>
            [job.title, job.company, job.location].some((field) =>
                field.toLowerCase().includes(term)
            )
        );
    }

    // Apply randomization or limit
    let displayedJobs = filteredJobs;
    if (random && limit > 0 && filteredJobs.length >= limit) {
        displayedJobs = [...filteredJobs].sort(() => 0.5 - Math.random()).slice(0, limit);
    } else if (limit > 0) {
        displayedJobs = filteredJobs.slice(0, limit);
    }

    return (
        <section className="py-16 px-4 sm:px-6 md:px-6 max-w-7xl mx-auto">
            {showIntro ? (
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        Explore Fresh Job Opportunities
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We've handpicked a few listings to get you started. Discover something exciting and aligned with your goals.
                    </p>
                </div>
            ) : (
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                    Latest Job Openings
                </h2>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedJobs.length > 0 ? (
                    displayedJobs.map((job) => (
                        <JobCard key={job.id ?? `${job.title}-${job.company}`} job={job} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No jobs found matching your search.
                    </p>
                )}
            </div>
        </section>
    );
};

export default JobList;
