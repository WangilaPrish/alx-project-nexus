# External Job Board API Integration Guide

## Overview
This integration allows your job board platform to display and interact with jobs from an external job board API (https://mysite-z2xs.onrender.com).

## Files Created

### 1. **External Jobs Service** (`src/services/externalJobsService.ts`)
- Complete API client for the external job board
- Handles authentication, job fetching, applications, and saved jobs
- Uses Basic authentication with the external API

### 2. **React Hooks** (`src/hooks/useExternalJobs.ts`)
- Custom hooks for easy integration in React components
- `useExternalJobs()` - Job listing with search and pagination
- `useExternalCategories()` - Job categories management
- `useExternalSavedJobs()` - Saved jobs functionality
- `useExternalJobApplication()` - Job application handling
- `useExternalAuth()` - External API authentication

### 3. **Explorer Component** (`src/components/ExternalJobsExplorer.tsx`)
- Complete React component showcasing the integration
- Job search, viewing, saving, and application functionality
- Responsive design with modal dialogs

## Available API Endpoints

### Authentication
- `POST /users/login/` - Login to external API
- `POST /users/register/` - Register new user
- `POST /users/logout/` - Logout

### Jobs
- `GET /jobs/` - List jobs (with search, pagination, ordering)
- `GET /jobs/{id}/` - Get job details
- `POST /jobs/{id}/apply/` - Apply to a job
- `POST /jobs/create/` - Create new job (for recruiters)
- `PUT /jobs/{id}/update/` - Update job
- `DELETE /jobs/{id}/delete/` - Delete job

### Categories
- `GET /categories/` - List job categories
- `POST /categories/create/` - Create category

### Applications
- `GET /applications/recruiter/` - Get applications (for recruiters)
- `PUT /applications/{id}/update/` - Update application status
- `DELETE /applications/{id}/delete/` - Delete application

### Saved Jobs
- `GET /saved-jobs/` - Get user's saved jobs
- `POST /saved-jobs/create/` - Save a job
- `DELETE /saved-jobs/{id}/delete/` - Remove saved job

## Integration Steps

### Step 1: Add to Your Routes
Add the external jobs explorer to your routing:

\`\`\`tsx
// In your App.tsx or routing file
import ExternalJobsExplorer from './components/ExternalJobsExplorer';

// Add route
<Route path="/external-jobs" element={<ExternalJobsExplorer />} />
\`\`\`

### Step 2: Add Navigation Link
Add a link to your navigation:

\`\`\`tsx
<Link to="/external-jobs">External Jobs</Link>
\`\`\`

### Step 3: Merge External Jobs with Your Internal Jobs
Update your existing job service to include external jobs:

\`\`\`tsx
import { externalJobsService } from './externalJobsService';

export const enhancedJobService = {
  // Get combined jobs from both internal and external sources
  getAllJobs: async (includeExternal = true) => {
    const promises = [
      jobService.getJobs(), // Your existing internal job service
    ];

    if (includeExternal) {
      promises.push(externalJobsService.getJobs());
    }

    const results = await Promise.allSettled(promises);

    const internalJobs = results[0].status === 'fulfilled' ? results[0].value.data : [];
    const externalJobs = results[1]?.status === 'fulfilled' ?
      results[1].value.data?.results.map(externalJobsService.convertExternalJob) : [];

    return [...internalJobs, ...externalJobs];
  }
};
\`\`\`

### Step 4: Authentication Flow
The external API requires users to authenticate separately. You can:

1. **Prompt users to login/register** with the external API
2. **Auto-register** users from your platform to the external API
3. **Store credentials securely** for seamless experience

Example auto-registration:

\`\`\`tsx
const autoRegisterWithExternalAPI = async (user) => {
  try {
    await externalJobsService.register({
      email: user.email,
      first_name: user.name.split(' ')[0],
      last_name: user.name.split(' ').slice(1).join(' '),
      password: generateSecurePassword(), // Generate or prompt for password
      confirm_password: password,
    });
  } catch (error) {
    console.log('External registration failed:', error);
  }
};
\`\`\`

## Configuration Options

### Environment Variables
Consider adding these to your `.env` file:

\`\`\`
REACT_APP_EXTERNAL_JOB_API_URL=https://mysite-z2xs.onrender.com/api
REACT_APP_ENABLE_EXTERNAL_JOBS=true
\`\`\`

### Customization
You can customize the integration by:

1. **Modifying the UI** in `ExternalJobsExplorer.tsx`
2. **Adding filters** for external vs internal jobs
3. **Customizing the data mapping** in `convertExternalJob()`
4. **Adding caching** for better performance

## Security Considerations

1. **Authentication**: The external API uses Basic auth - consider implementing secure credential storage
2. **Data Validation**: Always validate external API responses
3. **Rate Limiting**: Implement rate limiting to avoid hitting API limits
4. **Error Handling**: Graceful fallbacks when external API is unavailable

## Usage Examples

### Basic Job Listing
\`\`\`tsx
import { useExternalJobs } from '../hooks/useExternalJobs';

const JobsList = () => {
  const { jobs, loading, error, searchJobs } = useExternalJobs();

  return (
    <div>
      {jobs.map(job => (
        <div key={job.id}>{job.title}</div>
      ))}
    </div>
  );
};
\`\`\`

### Search Jobs
\`\`\`tsx
const searchHandler = (searchTerm) => {
  searchJobs(searchTerm);
};
\`\`\`

### Save/Unsave Jobs
\`\`\`tsx
import { useExternalSavedJobs } from '../hooks/useExternalJobs';

const SaveButton = ({ jobId }) => {
  const { saveJob, removeSavedJob, isJobSaved } = useExternalSavedJobs();

  const handleToggleSave = () => {
    if (isJobSaved(jobId)) {
      removeSavedJob(jobId);
    } else {
      saveJob(jobId);
    }
  };

  return (
    <button onClick={handleToggleSave}>
      {isJobSaved(jobId) ? 'Unsave' : 'Save'}
    </button>
  );
};
\`\`\`

## API Response Examples

### Job Object
\`\`\`json
{
  "id": 1,
  "title": "Frontend Developer",
  "company_name": "Tech Corp",
  "location": "New York, NY",
  "salary": "$80,000 - $120,000",
  "job_type": "FT",
  "category_name": "Technology",
  "industry": "Software",
  "description": "We are looking for...",
  "status": "OPEN",
  "posted_at": "2024-01-15T10:00:00Z",
  "view_count": 45
}
\`\`\`

### Paginated Response
\`\`\`json
{
  "count": 150,
  "next": "https://api.example.com/jobs/?page=2",
  "previous": null,
  "results": [/* job objects */]
}
\`\`\`

## Benefits of Integration

1. **Expanded Job Listings**: Access to more job opportunities
2. **Enhanced User Experience**: Users can find jobs from multiple sources
3. **Competitive Advantage**: Offer more comprehensive job search
4. **Data Insights**: Analyze trends across multiple job boards
5. **Monetization**: Potential for partnerships and referral programs

## Next Steps

1. Test the integration in development
2. Implement error boundaries for production
3. Add analytics to track external job interactions
4. Consider implementing job synchronization
5. Explore additional external APIs for more job sources

## Support

- External API Documentation: https://mysite-z2xs.onrender.com/api/docs/
- ReDoc Documentation: https://mysite-z2xs.onrender.com/redoc/
