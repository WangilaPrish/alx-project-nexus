import { Job } from '../context/JobContext';

export const fetchJobs = async (): Promise<Job[]> => {
  // Replace this with an actual API call later
  return [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'Remote',
      type: 'Full-time',
      experienceLevel: 'Mid-Level',
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'Designify',
      location: 'Nairobi',
      type: 'Contract',
      experienceLevel: 'Entry-Level',
    },
  ];
};
