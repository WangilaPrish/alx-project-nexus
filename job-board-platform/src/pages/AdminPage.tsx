import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">Admin Dashboard</h1>
        <nav>
          <Link to="/" className="text-blue-500 hover:underline mr-4">Home</Link>
          <Link to="/find-jobs" className="text-blue-500 hover:underline mr-4">Find Jobs</Link>
          <Link to="/applied-jobs" className="text-blue-500 hover:underline">Applied Jobs</Link>
        </nav>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p className="text-gray-600 mb-4">View, search, and manage registered users.</p>
          {/* TODO: Add user table/list here */}
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Job Management</h2>
          <p className="text-gray-600 mb-4">View, edit, and delete job postings.</p>
          {/* TODO: Add job table/list here */}
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Admin Actions</h2>
          <p className="text-gray-600 mb-4">Perform admin tasks like user cleanup, stats, etc.</p>
          {/* TODO: Add admin actions here */}
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
