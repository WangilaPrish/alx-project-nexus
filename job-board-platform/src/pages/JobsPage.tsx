// src/pages/JobsPage.tsx

import { useState } from 'react';
import JobList from '../components/JobList';

const JobsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-12">
            <section className="max-w-4xl mx-auto mb-10">
                <h1 className="text-3xl font-bold text-center mb-6">Find Your Next Opportunity</h1>
                <input
                    type="text"
                    placeholder="Search jobs by title, company, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </section>

            <JobList searchTerm={searchTerm} />
        </main>
    );
};

export default JobsPage;
