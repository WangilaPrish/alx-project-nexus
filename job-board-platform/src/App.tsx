import { Route, Routes } from 'react-router-dom';
import Home from '../src/pages/Home';
import ExternalJobsExplorer from './components/ExternalJobsExplorer';
import JobsDashboard from './components/JobsDashboard';
import AppliedJobsPage from './pages/AppliedJobsPage';
import JobsPage from './pages/JobsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
//import JobDetails from './pages/JobDetails';
//import Apply from './pages/Apply';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/all-jobs" element={<JobsDashboard />} />
            <Route path="/external-jobs" element={<ExternalJobsExplorer />} />
            <Route path="/applied" element={<AppliedJobsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
    );
};

export default App;
