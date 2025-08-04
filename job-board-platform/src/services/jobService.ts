import type { Job } from '../types'; // Adjust path if needed

// JSearch API
const fetchJobsFromJSearch = async (): Promise<Job[]> => {
    const url = 'https://jsearch.p.rapidapi.com/search?query=developer%20jobs%20in%20chicago&page=1&num_pages=1&country=us&date_posted=all';

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '3a67b983fcmsh933330d1e3537c3p1a5f33jsnf5af25fe41ff',
            'x-rapidapi-host': 'jsearch.p.rapidapi.com',
        },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to fetch jobs from JSearch');
        }

        const data = await response.json();
        console.log('JSearch API result:', data);

        return (data.data || []).map((job: any, index: number) => ({
            id: job.job_id || index.toString(),
            title: job.job_title || 'Untitled',
            company: job.employer_name || 'Unknown Company',
            location: `${job.job_city || ''}, ${job.job_country || ''}`.trim(),
            type: job.job_employment_type || 'Full-time',
            experienceLevel: job.job_experience || 'Not specified',
            description: job.job_description || '',
            applyLink: job.job_apply_link || '',
            salary:
                job.job_min_salary && job.job_max_salary
                    ? `${job.job_min_salary} - ${job.job_max_salary} ${job.job_salary_currency}`
                    : 'Not specified',
            postedAt: job.job_posted_at_datetime_utc || '',
        }));
    } catch (error) {
        console.error('JSearch API Error:', error);
        throw new Error('Failed to load jobs from JSearch');
    }
};

// JOBS SEARCH API
const fetchJobsFromJobsSearchAPI = async (): Promise<Job[]> => {
    const url = 'https://jobs-search-api.p.rapidapi.com/getjobs';

    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '3a67b983fcmsh933330d1e3537c3p1a5f33jsnf5af25fe41ff',
            'x-rapidapi-host': 'jobs-search-api.p.rapidapi.com',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            search_term: 'developer',
            location: 'new york',
            results_wanted: 10,
            site_name: ['indeed', 'linkedin', 'zip_recruiter', 'glassdoor'],
            distance: 50,
            job_type: 'fulltime',
            is_remote: false,
            linkedin_fetch_description: true,
            hours_old: 72,
        }),
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Failed to fetch jobs from JOBS SEARCH API');
        const data = await response.json();

        console.log('Jobs Search API result:', data);

        return (data.jobs || []).map((job: any, index: number) => ({
            id: job.job_id || `${job.title}-${index}`,
            title: job.title || 'Untitled',
            company: job.company_name || 'Unknown Company',
            location: job.location || 'Unspecified',
            type: job.job_type || 'Full-time',
            experienceLevel: job.experience_level || 'Not specified',
            postedAt: job.date_posted || null,
            applyLink: job.job_url || null,
            salary: job.salary || null,
            description: job.description || '',
        }));
    } catch (error) {
        console.error('Jobs Search API Error:', error);
        throw new Error('Could not load jobs from Jobs Search API');
    }
};

// Combine both APIs
export const fetchJobs = async (): Promise<Job[]> => {
    try {
        const [jsearchJobs, jobsSearchAPIJobs] = await Promise.all([
            fetchJobsFromJSearch(),
            fetchJobsFromJobsSearchAPI(),
        ]);
        return [...jsearchJobs, ...jobsSearchAPIJobs];
    } catch (error) {
        console.error('Combined Jobs Error:', error);
        throw new Error('Failed to fetch jobs from all sources');
    }
};
