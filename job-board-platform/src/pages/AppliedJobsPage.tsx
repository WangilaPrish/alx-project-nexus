import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { HiCalendar, HiExternalLink, HiLocationMarker, HiOfficeBuilding, HiPlus, HiTrash } from 'react-icons/hi';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/NavBar';
import { useAppliedJobs } from '../context/AppliedJobsContext';
import { useAuth } from '../context/AuthContext';
import type { AppliedJob, Job } from '../types';

const AppliedJobsPage = () => {
    const { appliedJobs, loading, error, updateApplicationStatus, removeApplication, addExternalApplication } = useAppliedJobs();
    const { user } = useAuth();
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newJob, setNewJob] = useState<Partial<Job>>({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        experienceLevel: 'Mid-level'
    });
    const [externalUrl, setExternalUrl] = useState('');
    const [notes, setNotes] = useState('');

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="pt-20 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
                        <p className="text-gray-600">You need to be signed in to view your applied jobs.</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const filteredJobs = selectedStatus === 'all'
        ? appliedJobs
        : appliedJobs.filter(job => job.applicationStatus === selectedStatus);

    const statusColors = {
        applied: 'bg-blue-100 text-blue-800',
        viewed: 'bg-yellow-100 text-yellow-800',
        interviewed: 'bg-purple-100 text-purple-800',
        rejected: 'bg-red-100 text-red-800',
        accepted: 'bg-green-100 text-green-800'
    };

    const handleStatusUpdate = async (applicationId: string, newStatus: AppliedJob['applicationStatus']) => {
        try {
            await updateApplicationStatus(applicationId, newStatus);
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleRemoveApplication = async (applicationId: string) => {
        if (window.confirm('Are you sure you want to remove this application?')) {
            try {
                await removeApplication(applicationId);
            } catch (err) {
                console.error('Failed to remove application:', err);
            }
        }
    };

    const handleAddExternalJob = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newJob.title || !newJob.company || !externalUrl) return;

        try {
            const jobToAdd: Job = {
                id: `external_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: newJob.title || '',
                company: newJob.company || '',
                location: newJob.location || 'Remote',
                type: newJob.type || 'Full-time',
                experienceLevel: newJob.experienceLevel || 'Mid-level',
                description: `Applied externally via ${externalUrl}`,
                applyLink: externalUrl
            };

            await addExternalApplication(jobToAdd, externalUrl, notes);

            // Reset form
            setNewJob({
                title: '',
                company: '',
                location: '',
                type: 'Full-time',
                experienceLevel: 'Mid-level'
            });
            setExternalUrl('');
            setNotes('');
            setShowAddForm(false);
        } catch (err) {
            console.error('Failed to add external job:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20 pb-12">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-bold text-gray-900 mb-4"
                        >
                            My Applied Jobs
                        </motion.h1>
                        <p className="text-gray-600">
                            Track all your job applications, including those applied on external websites
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {['all', 'applied', 'viewed', 'interviewed', 'rejected', 'accepted'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedStatus === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                                        }`}
                                >
                                    {status === 'all' ? 'All Applications' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <HiPlus className="w-4 h-4" />
                            Add External Application
                        </button>
                    </div>

                    {/* Add External Job Form */}
                    <AnimatePresence>
                        {showAddForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-white rounded-lg shadow-md p-6 mb-6"
                            >
                                <h3 className="text-lg font-semibold mb-4">Add External Job Application</h3>
                                <form onSubmit={handleAddExternalJob} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Job Title"
                                            value={newJob.title}
                                            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Company"
                                            value={newJob.company}
                                            onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                                            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Location"
                                            value={newJob.location}
                                            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <select
                                            value={newJob.type}
                                            onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                                            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="External Application URL"
                                        value={externalUrl}
                                        onChange={(e) => setExternalUrl(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    <textarea
                                        placeholder="Notes (optional)"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                    />
                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Add Application
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading and Error States */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading your applications...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {/* Applied Jobs List */}
                    {!loading && filteredJobs.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <HiOfficeBuilding className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
                            <p className="text-gray-600 mb-4">
                                {selectedStatus === 'all'
                                    ? "You haven't applied to any jobs yet. Start browsing and applying!"
                                    : `No applications with status: ${selectedStatus}`
                                }
                            </p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Add Your First Application
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredJobs.map((appliedJob, index) => (
                                <motion.div
                                    key={appliedJob.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {appliedJob.job.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <HiOfficeBuilding className="w-4 h-4" />
                                                    {appliedJob.job.company}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <HiLocationMarker className="w-4 h-4" />
                                                    {appliedJob.job.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <HiCalendar className="w-4 h-4" />
                                                    Applied: {new Date(appliedJob.appliedAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {appliedJob.externalUrl && (
                                                <a
                                                    href={appliedJob.externalUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mb-2"
                                                >
                                                    <HiExternalLink className="w-4 h-4" />
                                                    View External Application
                                                </a>
                                            )}

                                            {appliedJob.notes && (
                                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                    <strong>Notes:</strong> {appliedJob.notes}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <select
                                                value={appliedJob.applicationStatus}
                                                onChange={(e) => handleStatusUpdate(appliedJob.id, e.target.value as AppliedJob['applicationStatus'])}
                                                className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${statusColors[appliedJob.applicationStatus]}`}
                                            >
                                                <option value="applied">Applied</option>
                                                <option value="viewed">Viewed</option>
                                                <option value="interviewed">Interviewed</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="accepted">Accepted</option>
                                            </select>

                                            <button
                                                onClick={() => handleRemoveApplication(appliedJob.id)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Remove application"
                                            >
                                                <HiTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                            {appliedJob.job.type}
                                        </span>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                            {appliedJob.job.experienceLevel}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default AppliedJobsPage;
