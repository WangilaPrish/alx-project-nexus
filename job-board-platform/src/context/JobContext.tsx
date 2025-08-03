import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { fetchJobs } from '../services/jobService';

// Types
export interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    experienceLevel: string;
}

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <JobContext.Provider value={{ jobs, loading, error, filters, setFilters }}>
            {children}
        </JobContext.Provider>
    );
};
