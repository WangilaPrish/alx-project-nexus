import JobCard from './JobCard';
import { useJobContext } from '../context/JobContext';
import { motion } from 'framer-motion';

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

    // Framer motion variants
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
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
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
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        Explore Fresh Job Opportunities
                    </h2>
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

                </motion.h2>
            )}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {displayedJobs.length > 0 ? (
                    displayedJobs.map((job) => (
                        <motion.div key={job.id ?? `${job.title}-${job.company}`} variants={cardVariants}>
                            <JobCard job={job} />
                        </motion.div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No jobs found matching your search.
                    </p>
                )}
            </motion.div>
        </section>
    );
};

export default JobList;
