import type { Job } from '../types';

export const fetchJobs = async (): Promise<Job[]> => {
    const totalPages = 5; // You can increase this if needed
    const jobs: Job[] = [];

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '3a67b983fcmsh933330d1e3537c3p1a5f33jsnf5af25fe41ff',
            'x-rapidapi-host': 'jsearch.p.rapidapi.com',
        },
    };

    for (let page = 1; page <= totalPages; page++) {
        const url = `https://jsearch.p.rapidapi.com/search?query=developer%20jobs&page=${page}&num_pages=1&country=us&date_posted=all`;

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Failed to fetch jobs on page ${page}`);
            }

            const data = await response.json();

            const mappedJobs = (data.data || []).map((job: any, index: number) => ({
                id: job.job_id || `${page}-${index}`,
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

            jobs.push(...mappedJobs);
        } catch (error) {
            console.error(`JSearch API Error on page ${page}:`, error);
        }
    }

    return jobs;
};
