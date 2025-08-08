import { useEffect, useState } from 'react';
import type { ExternalJob, ExternalJobCategory, ExternalSavedJob } from '../services/externalJobsService';
import { externalJobsService } from '../services/externalJobsService';

// Custom hook for managing external jobs
export const useExternalJobs = () => {
    const [jobs, setJobs] = useState<ExternalJob[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const fetchJobs = async (params?: {
        search?: string;
        ordering?: string;
        page?: number;
        size?: number;
        reset?: boolean;
    }) => {
        setLoading(true);
        setError(null);

        try {
            const result = await externalJobsService.getJobs(params);

            if (result.success && result.data) {
                if (params?.reset || params?.page === 1) {
                    setJobs(result.data.results);
                } else {
                    setJobs(prev => [...prev, ...result.data.results]);
                }

                setTotalCount(result.data.count);
                setHasMore(!!result.data.next);
                setCurrentPage(params?.page || 1);
            } else {
                setError(result.message || 'Failed to fetch jobs');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const searchJobs = (searchTerm: string) => {
        fetchJobs({ search: searchTerm, page: 1, reset: true });
    };

    const loadMore = () => {
        if (hasMore && !loading) {
            fetchJobs({ page: currentPage + 1 });
        }
    };

    const refresh = () => {
        fetchJobs({ page: 1, reset: true });
    };

    return {
        jobs,
        loading,
        error,
        totalCount,
        hasMore,
        currentPage,
        fetchJobs,
        searchJobs,
        loadMore,
        refresh,
    };
};

// Custom hook for managing job categories
export const useExternalCategories = () => {
    const [categories, setCategories] = useState<ExternalJobCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await externalJobsService.getCategories();

            if (result.success && result.data) {
                setCategories(result.data.results);
            } else {
                setError(result.message || 'Failed to fetch categories');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        loading,
        error,
        refresh: fetchCategories,
    };
};

// Custom hook for managing saved jobs
export const useExternalSavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState<ExternalSavedJob[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSavedJobs = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await externalJobsService.getSavedJobs();

            if (result.success && result.data) {
                setSavedJobs(result.data.results);
            } else {
                setError(result.message || 'Failed to fetch saved jobs');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const saveJob = async (jobId: number) => {
        try {
            const result = await externalJobsService.saveJob(jobId);

            if (result.success) {
                fetchSavedJobs(); // Refresh the list
                return { success: true, message: result.message };
            } else {
                return { success: false, message: result.message };
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to save job';
            return { success: false, message };
        }
    };

    const removeSavedJob = async (savedJobId: string) => {
        try {
            const result = await externalJobsService.removeSavedJob(savedJobId);

            if (result.success) {
                setSavedJobs(prev => prev.filter(job => job.id.toString() !== savedJobId));
                return { success: true, message: result.message };
            } else {
                return { success: false, message: result.message };
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to remove saved job';
            return { success: false, message };
        }
    };

    const isJobSaved = (jobId: number) => {
        return savedJobs.some(savedJob => savedJob.job === jobId);
    };

    useEffect(() => {
        if (externalJobsService.isExternalAuthenticated()) {
            fetchSavedJobs();
        }
    }, []);

    return {
        savedJobs,
        loading,
        error,
        saveJob,
        removeSavedJob,
        isJobSaved,
        refresh: fetchSavedJobs,
    };
};

// Custom hook for applying to jobs
export const useExternalJobApplication = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const applyToJob = async (jobId: number, coverLetter: string) => {
        setLoading(true);
        setError(null);

        try {
            const result = await externalJobsService.applyToJob(jobId, {
                cover_letter: coverLetter,
            });

            if (result.success) {
                return { success: true, message: result.message };
            } else {
                setError(result.message || 'Failed to apply to job');
                return { success: false, message: result.message };
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to apply to job';
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    return {
        applyToJob,
        loading,
        error,
    };
};

// Custom hook for external API authentication
export const useExternalAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsAuthenticated(externalJobsService.isExternalAuthenticated());
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        setLoading(true);
        setError(null);

        try {
            const result = await externalJobsService.login(credentials);

            if (result.success) {
                setIsAuthenticated(true);
                return { success: true, message: result.message };
            } else {
                setError(result.message || 'Login failed');
                return { success: false, message: result.message };
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: {
        email: string;
        first_name: string;
        last_name: string;
        password: string;
        confirm_password: string;
    }) => {
        setLoading(true);
        setError(null);

        try {
            const result = await externalJobsService.register(userData);

            if (result.success) {
                return { success: true, message: result.message };
            } else {
                setError(result.message || 'Registration failed');
                return { success: false, message: result.message };
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Registration failed';
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);

        try {
            await externalJobsService.logout();
            setIsAuthenticated(false);
            return { success: true, message: 'Logged out successfully' };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Logout failed';
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    return {
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
    };
};
