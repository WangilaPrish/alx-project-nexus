import JobCard from './JobCard';
import { useJobContext } from '../context/JobContext';
import { motion } from 'framer-motion';

type JobListProps = {
    limit?: number;
    random?: boolean;
    showIntro?: boolean;
    searchTerm?: string;
};

const JobList = ({ limit = 0, random = false, showIntro = false, searchTerm = '' }: JobListProps) => {
    const { jobs, loading, error, currentPage, setCurrentPage, jobsPerPage } = useJobContext();

    if (loading) return <p className="text-center text-gray-500 py-8">Loading jobs...</p>;
    if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

    let filteredJobs = jobs;
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredJobs = jobs.filter((job) =>
            [job.title, job.company, job.location].some((field) =>
                field.toLowerCase().includes(term)
            )
        );
    }

    // Pagination logic
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.42, 0, 0.58, 1] } } // Use cubic-bezier array for ease
    };

    return (
        <section className="py-12 px-4 sm:px-6 md:px-6 max-w-7xl mx-auto">
            {showIntro ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">Explore Fresh Job Opportunities</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We've handpicked a few listings to get you started. Discover something exciting and aligned with your goals.
                    </p>
                </motion.div>
            ) : (
                <motion.h2
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-2xl md:text-3xl font-bold mb-8 text-center"
                >
                    Latest Job Openings
                </motion.h2>
            )}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {currentJobs.length > 0 ? (
                    currentJobs.map((job) => (
                        <motion.div key={job.id} variants={cardVariants}>
                            <JobCard job={job} />
                        </motion.div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No jobs found matching your search.
                    </p>
                )}
            </motion.div>

            {/* Pagination controls */}
            <div className="flex justify-center mt-10 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    >
                        {i + 1}
                    </button>
                ))}

            </div>
        </section>
    );
};

export default JobList;
