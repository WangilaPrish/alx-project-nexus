import { Route, Routes } from 'react-router-dom';
import Home from '../src/pages/Home';
import AppliedJobsPage from './pages/AppliedJobsPage';
import JobsPage from './pages/JobsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
//import JobDetails from './pages/JobDetails';
//import Apply from './pages/Apply';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/applied" element={<AppliedJobsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPage />} />
        </Routes>
    );
};

export default App;
