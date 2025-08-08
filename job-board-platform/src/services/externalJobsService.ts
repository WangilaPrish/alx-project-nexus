// External Job Board API Service
// API Documentation: https://mysite-z2xs.onrender.com/api/docs/

// Types for the external API
export interface ExternalJob {
    id: number;
    posted_by: string;
    category_name: string;
    category: string;
    salary: string;
    title: string;
    description: string;
    industry: string;
    location: string;
    job_type: 'FT' | 'PT' | 'CT' | 'IN' | 'FR'; // Full-time, Part-time, Contract, Internship, Freelance
    company_name: string;
    status: 'OPEN' | 'CLOSED';
    posted_at: string;
    expires_at?: string;
    view_count: number;
}

export interface ExternalJobCategory {
    id: number;
    category_name: string;
}

export interface ExternalJobApplication {
    id: number;
    applicant: string;
    status: 'PENDING' | 'REVIEWED' | 'INTERVIEW' | 'REJECTED' | 'HIRED';
    resume: string;
    cover_letter: string;
    applied_at: string;
    job: number;
}

export interface ExternalSavedJob {
    id: number;
    job: number;
    job_title: string;
    saved_at: string;
}

export interface ExternalUserProfile {
    id: number;
    first_name: string;
    last_name: string;
    country: string;
    phone_number?: string;
    job_title?: string;
    gender?: 'M' | 'F';
    profile_picture?: string;
    bio?: string;
    resume?: string;
    linkedin?: string;
    skills?: string;
    portfolio?: string;
    profile_completed: boolean;
    user: number;
}

export interface PaginatedResponse<T> {
    count: number;
    next?: string;
    previous?: string;
    results: T[];
}

// API Configuration
const EXTERNAL_API_BASE_URL = 'https://mysite-z2xs.onrender.com/api';

const EXTERNAL_API_ENDPOINTS = {
    // Authentication
    LOGIN: `${EXTERNAL_API_BASE_URL}/users/login/`,
    REGISTER: `${EXTERNAL_API_BASE_URL}/users/register/`,
    LOGOUT: `${EXTERNAL_API_BASE_URL}/users/logout/`,

    // Jobs
    JOBS: `${EXTERNAL_API_BASE_URL}/jobs/`,
    JOB_CREATE: `${EXTERNAL_API_BASE_URL}/jobs/create/`,
    JOB_DETAIL: (id: number) => `${EXTERNAL_API_BASE_URL}/jobs/${id}/`,
    JOB_APPLY: (id: number) => `${EXTERNAL_API_BASE_URL}/jobs/${id}/apply/`,
    JOB_UPDATE: (id: number) => `${EXTERNAL_API_BASE_URL}/jobs/${id}/update/`,
    JOB_DELETE: (id: number) => `${EXTERNAL_API_BASE_URL}/jobs/${id}/delete/`,

    // Categories
    CATEGORIES: `${EXTERNAL_API_BASE_URL}/categories/`,
    CATEGORY_CREATE: `${EXTERNAL_API_BASE_URL}/categories/create/`,
    CATEGORY_UPDATE: (id: number) => `${EXTERNAL_API_BASE_URL}/categories/${id}/update/`,
    CATEGORY_DELETE: (id: number) => `${EXTERNAL_API_BASE_URL}/categories/${id}/delete/`,

    // Applications
    APPLICATIONS: `${EXTERNAL_API_BASE_URL}/applications/recruiter/`,
    APPLICATION_UPDATE: (id: string) => `${EXTERNAL_API_BASE_URL}/applications/${id}/update/`,
    APPLICATION_DELETE: (id: string) => `${EXTERNAL_API_BASE_URL}/applications/${id}/delete/`,

    // Saved Jobs
    SAVED_JOBS: `${EXTERNAL_API_BASE_URL}/saved-jobs/`,
    SAVED_JOB_CREATE: `${EXTERNAL_API_BASE_URL}/saved-jobs/create/`,
    SAVED_JOB_DELETE: (id: string) => `${EXTERNAL_API_BASE_URL}/saved-jobs/${id}/delete/`,

    // Profile
    PROFILE: `${EXTERNAL_API_BASE_URL}/users/profile/update/`,
    PROFILE_STATUS: `${EXTERNAL_API_BASE_URL}/users/profile/status/`,
    PROFILE_RESUME: `${EXTERNAL_API_BASE_URL}/users/profile/resume/`,
    REQUEST_ROLE: `${EXTERNAL_API_BASE_URL}/users/request-role/`,
};

// Helper function to get auth headers
const getExternalAuthHeaders = () => {
    // This API uses Basic authentication
    // You would need to store the user's credentials or token
    const credentials = localStorage.getItem('external_api_credentials');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (credentials) {
        headers['Authorization'] = `Basic ${credentials}`;
    }

    return headers;
};

export const externalJobsService = {
    // ============= JOB OPERATIONS =============

    // Get all jobs with filtering and pagination
    getJobs: async (params?: {
        search?: string;
        ordering?: string;
        page?: number;
        size?: number;
    }) => {
        try {
            const searchParams = new URLSearchParams();
            if (params?.search) searchParams.append('search', params.search);
            if (params?.ordering) searchParams.append('ordering', params.ordering);
            if (params?.page) searchParams.append('page', params.page.toString());
            if (params?.size) searchParams.append('size', params.size.toString());

            const url = `${EXTERNAL_API_ENDPOINTS.JOBS}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: getExternalAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch jobs: ${response.status}`);
            }

            const data: PaginatedResponse<ExternalJob> = await response.json();
            return {
                success: true,
                data,
            };
        } catch (error) {
            console.error('Error fetching external jobs:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch jobs',
            };
        }
    },

    // Get a specific job by ID
    getJobById: async (id: number) => {
        try {
            const response = await fetch(EXTERNAL_API_ENDPOINTS.JOB_DETAIL(id), {
                method: 'GET',
                headers: getExternalAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch job: ${response.status}`);
            }

            const data: ExternalJob = await response.json();
            return {
                success: true,
                data,
            };
        } catch (error) {
            console.error('Error fetching job:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch job',
            };
        }
    },

    // Apply to a job
    applyToJob: async (jobId: number, applicationData: {
        cover_letter: string;
        // Note: resume is handled automatically by the API based on user profile
    }) => {
        try {
            const response = await fetch(EXTERNAL_API_ENDPOINTS.JOB_APPLY(jobId), {
                method: 'POST',
                headers: getExternalAuthHeaders(),
                body: JSON.stringify(applicationData),
            });

            if (!response.ok) {
                throw new Error(`Failed to apply to job: ${response.status}`);
            }

            const data: ExternalJobApplication = await response.json();
            return {
                success: true,
                data,
                message: 'Application submitted successfully!',
            };
        } catch (error) {
            console.error('Error applying to job:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to apply to job',
            };
        }
    },

    // ============= CATEGORY OPERATIONS =============

    // Get all job categories
    getCategories: async (page?: number) => {
        try {
            const url = page
                ? `${EXTERNAL_API_ENDPOINTS.CATEGORIES}?page=${page}`
                : EXTERNAL_API_ENDPOINTS.CATEGORIES;

            const response = await fetch(url, {
                method: 'GET',
                headers: getExternalAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch categories: ${response.status}`);
            }

            const data: PaginatedResponse<ExternalJobCategory> = await response.json();
            return {
                success: true,
                data,
            };
        } catch (error) {
            console.error('Error fetching categories:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch categories',
            };
        }
    },

    // ============= SAVED JOBS OPERATIONS =============

    // Get user's saved jobs
    getSavedJobs: async (page?: number) => {
        try {
            const url = page
                ? `${EXTERNAL_API_ENDPOINTS.SAVED_JOBS}?page=${page}`
                : EXTERNAL_API_ENDPOINTS.SAVED_JOBS;

            const response = await fetch(url, {
                method: 'GET',
                headers: getExternalAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch saved jobs: ${response.status}`);
            }

            const data: PaginatedResponse<ExternalSavedJob> = await response.json();
            return {
                success: true,
                data,
            };
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch saved jobs',
            };
        }
    },

    // Save a job
    saveJob: async (jobId: number) => {
        try {
            const response = await fetch(EXTERNAL_API_ENDPOINTS.SAVED_JOB_CREATE, {
                method: 'POST',
                headers: getExternalAuthHeaders(),
                body: JSON.stringify({ job: jobId }),
            });

            if (!response.ok) {
                throw new Error(`Failed to save job: ${response.status}`);
            }

            const data: ExternalSavedJob = await response.json();
            return {
                success: true,
                data,
                message: 'Job saved successfully!',
            };
        } catch (error) {
            console.error('Error saving job:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to save job',
            };
        }
    },

    // Remove a saved job
    removeSavedJob: async (savedJobId: string) => {
        try {
            const response = await fetch(EXTERNAL_API_ENDPOINTS.SAVED_JOB_DELETE(savedJobId), {
                method: 'DELETE',
                headers: getExternalAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`Failed to remove saved job: ${response.status}`);
            }

            return {
                success: true,
                message: 'Job removed from saved list!',
            };
        } catch (error) {
            console.error('Error removing saved job:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to remove saved job',
            };
        }
    },

    // ============= APPLICATION OPERATIONS =============

    // Get applications (for recruiters)
    getApplications: async (page?: number) => {
        try {
            const url = page
                ? `${EXTERNAL_API_ENDPOINTS.APPLICATIONS}?page=${page}`
                : EXTERNAL_API_ENDPOINTS.APPLICATIONS;

            const response = await fetch(url, {
                method: 'GET',
                headers: getExternalAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch applications: ${response.status}`);
            }

            const data: PaginatedResponse<ExternalJobApplication> = await response.json();
            return {
                success: true,
                data,
            };
        } catch (error) {
            console.error('Error fetching applications:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch applications',
            };
        }
    },

    // ============= AUTHENTICATION OPERATIONS =============

    // Login to external API
    login: async (credentials: { email: string; password: string }) => {
        try {
            const response = await fetch(EXTERNAL_API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error(`Login failed: ${response.status}`);
            }

            const data = await response.json();

            // Store credentials for Basic auth (you might want to handle this differently)
            const basicAuth = btoa(`${credentials.email}:${credentials.password}`);
            localStorage.setItem('external_api_credentials', basicAuth);

            return {
                success: true,
                data,
                message: 'Logged in to external job board successfully!',
            };
        } catch (error) {
            console.error('External API login error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'External login failed',
            };
        }
    },

    // Register with external API
    register: async (userData: {
        email: string;
        first_name: string;
        last_name: string;
        password: string;
        confirm_password: string;
    }) => {
        try {
            const response = await fetch(EXTERNAL_API_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`Registration failed: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data,
                message: 'Registered with external job board successfully!',
            };
        } catch (error) {
            console.error('External API registration error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'External registration failed',
            };
        }
    },

    // Logout from external API
    logout: async () => {
        try {
            await fetch(EXTERNAL_API_ENDPOINTS.LOGOUT, {
                method: 'POST',
                headers: getExternalAuthHeaders(),
            });

            // Clear stored credentials
            localStorage.removeItem('external_api_credentials');

            return {
                success: true,
                message: 'Logged out from external job board successfully!',
            };
        } catch (error) {
            console.error('External API logout error:', error);
            // Clear credentials even on error
            localStorage.removeItem('external_api_credentials');
            return {
                success: true,
                message: 'Logged out from external job board',
            };
        }
    },

    // ============= UTILITY FUNCTIONS =============

    // Check if user is authenticated with external API
    isExternalAuthenticated: () => {
        return !!localStorage.getItem('external_api_credentials');
    },

    // Convert external job to internal format
    convertExternalJob: (externalJob: ExternalJob) => {
        return {
            id: `ext_${externalJob.id}`, // Prefix to distinguish from internal jobs
            title: externalJob.title,
            company: externalJob.company_name,
            location: externalJob.location,
            description: externalJob.description,
            salary: externalJob.salary,
            type: externalJob.job_type,
            category: externalJob.category_name,
            industry: externalJob.industry,
            postedAt: externalJob.posted_at,
            expiresAt: externalJob.expires_at,
            status: externalJob.status,
            viewCount: externalJob.view_count,
            source: 'external' as const,
            externalId: externalJob.id,
        };
    },
};
