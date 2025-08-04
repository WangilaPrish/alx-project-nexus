export const fetchJobs = async () => {
  const url =
    'https://jobs-api14.p.rapidapi.com/list?query=Web%20Developer&location=United%20States&distance=1.0&language=en_GB&remoteOnly=false&datePosted=month&employmentTypes=fulltime%3Bparttime%3Bintern%3Bcontractor&index=0';

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '3a67b983fcmsh933330d1e3537c3p1a5f33jsnf5af25fe41ff',
      'x-rapidapi-host': 'jobs-api14.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to fetch jobs');
    }

    const result = await response.json();

    console.log('API result:', result);

    return result.jobs || []; // assuming the response is { jobs: [...] }
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to load jobs');
  }
};
