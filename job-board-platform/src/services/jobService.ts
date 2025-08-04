import type { Job } from '../types'; // Adjust path if needed

export const fetchJobs = async (): Promise<Job[]> => {
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
            throw new Error(err.message || 'Failed to fetch jobs');
        }

        const data = await response.json();
        console.log('JSearch API result:', data);

        const jobs: Job[] = (data.data || []).map((job: any, index: number) => ({
            id: job.job_id || index.toString(),
            title: job.job_title || 'Untitled',
            company: job.employer_name || 'Unknown Company',
            location: job.job_city || 'Unspecified',
            type: job.job_employment_type || 'Full-time',
            experienceLevel: job.job_experience || 'Not specified',
        }));

        return jobs;
    } catch (error) {
        console.error('API Error:', error);
        throw new Error('Failed to load jobs');
    }
};
