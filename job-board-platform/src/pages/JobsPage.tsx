import { useState } from 'react';
import JobList from '../components/JobList';

const JobsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [jobTypeFilter, setJobTypeFilter] = useState('');

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-22">
            <section className="max-w-4xl mx-auto mb-10">
                <h1 className="text-3xl font-bold text-center mb-6">Find Your Next Opportunity</h1>

                <div className="grid gap-4 md:grid-cols-3">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Keyword (title, company, etc)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Location Filter */}
                    <input
                        type="text"
                        placeholder="Location"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Job Type Filter */}
                    <select
                        value={jobTypeFilter}
                        onChange={(e) => setJobTypeFilter(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Job Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Remote">Remote</option>
                        <option value="Contract">Contract</option>
                    </select>
                </div>
            </section>

            <JobList
                searchTerm={searchTerm}
                locationFilter={locationFilter}
                jobTypeFilter={jobTypeFilter}
            />
        </main>
    );
};

export default JobsPage;
