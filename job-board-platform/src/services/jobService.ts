import type { Job } from '../types';

export const fetchJobs = async (): Promise<Job[]> => {
    const totalPages = 5; // Adjust as needed
    const jobs: Job[] = [];

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
            'x-rapidapi-host': import.meta.env.VITE_RAPIDAPI_HOST,
        },
    };

    const fetchPage = async (page: number): Promise<Job[]> => {
        const index = (page - 1) * 10;
        const url = `https://${import.meta.env.VITE_RAPIDAPI_HOST}/list?query=Web%20Developer&location=United%20States&distance=1.0&language=en_GB&remoteOnly=false&datePosted=month&employmentTypes=fulltime%3Bparttime%3Bintern%3Bcontractor&index=${index}`;

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                console.warn(`Skipping page ${page} due to fetch error. Status: ${response.status}`);
                return [];
            }

            const data = await response.json();
            if (!data?.data || !Array.isArray(data.data)) {
                console.warn(`Invalid data on page ${page}`);
                return [];
            }

            return data.data.map((job: any, index: number) => ({
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
                        ? `${job.job_min_salary} - ${job.job_max_salary} ${job.job_salary_currency || ''}`
                        : 'Not specified',
                postedAt: job.job_posted_at_datetime_utc || '',
            }));
        } catch (error) {
            console.error(`JSearch API Error on page ${page}:`, error);
            return [];
        }
    };

    for (let page = 1; page <= totalPages; page++) {
        const pageJobs = await fetchPage(page);
        jobs.push(...pageJobs);
    }

    return jobs;
};
