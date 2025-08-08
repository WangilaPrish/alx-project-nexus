export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    experienceLevel: string;
    description: string;
    applyLink: string;
    salary: string;
    postedAt: string;
}

export interface AppliedJob {
    id: string;
    jobId: string;
    userId: string;
    job: Job;
    appliedAt: string;
    applicationStatus: 'applied' | 'viewed' | 'interviewed' | 'rejected' | 'accepted';
    externalUrl?: string; // For jobs applied on external websites
    notes?: string;
}

export interface JobListProps {
    limit?: number;
    random?: boolean;
    showIntro?: boolean;
    searchTerm?: string;
}
