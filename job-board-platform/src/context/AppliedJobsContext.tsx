import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { AppliedJob, Job } from '../types';
import { useAuth } from './AuthContext';

interface AppliedJobsContextType {
    appliedJobs: AppliedJob[];
    loading: boolean;
    error: string;
    applyToJob: (job: Job, externalUrl?: string, notes?: string) => Promise<void>;
    updateApplicationStatus: (applicationId: string, status: AppliedJob['applicationStatus']) => Promise<void>;
    addExternalApplication: (job: Job, externalUrl: string, notes?: string) => Promise<void>;
    removeApplication: (applicationId: string) => Promise<void>;
}

const AppliedJobsContext = createContext<AppliedJobsContextType | undefined>(undefined);

export const AppliedJobsProvider = ({ children }: { children: ReactNode }) => {
    const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();

    // Load applied jobs from localStorage when user changes
    useEffect(() => {
        const loadAppliedJobs = () => {
            try {
                setLoading(true);
                const savedJobs = localStorage.getItem(`appliedJobs_${user?.uid}`);
                if (savedJobs) {
                    setAppliedJobs(JSON.parse(savedJobs));
                }
            } catch (err) {
                setError('Failed to load applied jobs');
                console.error('Error loading applied jobs:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadAppliedJobs();
        } else {
            setAppliedJobs([]);
        }
    }, [user]);

    const saveAppliedJobs = (jobs: AppliedJob[]) => {
        if (user) {
            try {
                localStorage.setItem(`appliedJobs_${user.uid}`, JSON.stringify(jobs));
                setAppliedJobs(jobs);
            } catch (err) {
                setError('Failed to save applied jobs');
                console.error('Error saving applied jobs:', err);
            }
        }
    };

    const applyToJob = async (job: Job, externalUrl?: string, notes?: string) => {
        if (!user) {
            throw new Error('User must be logged in to track job applications');
        }

        try {
            // Check if already applied
            const alreadyApplied = appliedJobs.some(appliedJob => appliedJob.jobId === job.id);
            if (alreadyApplied) {
                throw new Error('You have already marked this job as applied');
            }

            const newApplication: AppliedJob = {
                id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                jobId: job.id,
                userId: user.uid,
                job,
                appliedAt: new Date().toISOString(),
                applicationStatus: 'applied',
                externalUrl,
                notes
            };

            const updatedJobs = [...appliedJobs, newApplication];
            saveAppliedJobs(updatedJobs);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to mark job as applied');
            throw err;
        }
    };

    const addExternalApplication = async (job: Job, externalUrl: string, notes?: string) => {
        if (!user) {
            throw new Error('User must be logged in to add applications');
        }

        try {
            const newApplication: AppliedJob = {
                id: `ext_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                jobId: job.id,
                userId: user.uid,
                job,
                appliedAt: new Date().toISOString(),
                applicationStatus: 'applied',
                externalUrl,
                notes
            };

            const updatedJobs = [...appliedJobs, newApplication];
            saveAppliedJobs(updatedJobs);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add external application');
            throw err;
        }
    };

    const updateApplicationStatus = async (applicationId: string, status: AppliedJob['applicationStatus']) => {
        try {
            const updatedJobs = appliedJobs.map(job =>
                job.id === applicationId ? { ...job, applicationStatus: status } : job
            );
            saveAppliedJobs(updatedJobs);
        } catch (err) {
            setError('Failed to update application status');
            throw err;
        }
    };

    const removeApplication = async (applicationId: string) => {
        try {
            const updatedJobs = appliedJobs.filter(job => job.id !== applicationId);
            saveAppliedJobs(updatedJobs);
        } catch (err) {
            setError('Failed to remove application');
            throw err;
        }
    };

    return (
        <AppliedJobsContext.Provider
            value={{
                appliedJobs,
                loading,
                error,
                applyToJob,
                updateApplicationStatus,
                addExternalApplication,
                removeApplication
            }}
        >
            {children}
        </AppliedJobsContext.Provider>
    );
};

export const useAppliedJobs = () => {
    const context = useContext(AppliedJobsContext);
    if (!context) {
        throw new Error('useAppliedJobs must be used within AppliedJobsProvider');
    }
    return context;
};
