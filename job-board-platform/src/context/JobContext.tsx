import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Job } from '../types';
import { fetchJobs } from '../services/jobService';

interface Filters {
    category: string;
    location: string;
    experience: string;
}

interface JobContextType {
    jobs: Job[];
    loading: boolean;
    error: string;
    filters: Filters;
    setFilters: (filters: Filters) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    jobsPerPage: number;
    filteredJobs: Job[];
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filters, setFilters] = useState<Filters>({
        category: '',
        location: '',
        experience: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 9;

    const getJobs = async () => {
        try {
            setLoading(true);
            const data = await fetchJobs();
            setJobs(data);
        } catch {
            setError('Failed to fetch jobs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getJobs();
    }, []);

    // Filter jobs client-side
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchCategory = filters.category ? job.title.toLowerCase().includes(filters.category.toLowerCase()) : true;
            const matchLocation = filters.location ? job.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
            const matchExperience = filters.experience ? job.experienceLevel.toLowerCase().includes(filters.experience.toLowerCase()) : true;
            return matchCategory && matchLocation && matchExperience;
        });
    }, [jobs, filters]);

    return (
        <JobContext.Provider
            value={{
                jobs,
                loading,
                error,
                filters,
                setFilters,
                currentPage,
                setCurrentPage,
                jobsPerPage,
                filteredJobs
            }}
        >
            {children}
        </JobContext.Provider>
    );
};

export const useJobContext = () => {
    const context = useContext(JobContext);
    if (!context) {
        throw new Error('useJobContext must be used within a JobProvider');
    }
    return context;
};
