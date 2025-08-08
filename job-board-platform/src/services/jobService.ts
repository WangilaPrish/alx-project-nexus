
import type { Job } from '../types';

const appId = import.meta.env.VITE_ADZUNA_APP_ID;
const appKey = import.meta.env.VITE_ADZUNA_APP_KEY;

const COUNTRY = 'us'; // Change to 'ke' or another country code as needed
const RESULTS_PER_PAGE = 10;
const TOTAL_PAGES = 5;

export const fetchJobs = async (
    searchTerm: string = 'developer',
    location: string = 'New York'
): Promise<Job[]> => {
    const jobs: Job[] = [];

    const fetchPage = async (page: number): Promise<Job[]> => {
        const url = `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/${page}?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(
            searchTerm
        )}&where=${encodeURIComponent(location)}&results_per_page=${RESULTS_PER_PAGE}&content-type=application/json`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`Failed to fetch page ${page}. Status: ${response.status}`);
                return [];
            }

            const data = await response.json();
            if (!data?.results || !Array.isArray(data.results)) {
                console.warn(`Invalid job data on page ${page}`);
                return [];
            }

            return data.results.map((job: any, index: number) => ({
                id: job.id || `${page}-${index}`,
                title: job.title || 'Untitled',
                company: job.company?.display_name || 'Unknown Company',
                location: job.location?.display_name || 'Remote',
                type: job.contract_time || 'Full-time',
                experienceLevel: job.category?.label || 'Not specified',
                description: job.description || '',
                applyLink: job.redirect_url || '',
                salary:
                    job.salary_min && job.salary_max
                        ? `$${job.salary_min} - $${job.salary_max}`
                        : 'Not specified',
                postedAt: job.created || '',
            }));
        } catch (error) {
            console.error(`Error fetching Adzuna jobs on page ${page}:`, error);
            return [];
        }
    };

    for (let page = 1; page <= TOTAL_PAGES; page++) {
        const pageJobs = await fetchPage(page);
        jobs.push(...pageJobs);
    }

    return jobs;
};
