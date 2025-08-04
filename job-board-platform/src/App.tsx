import { Routes, Route } from 'react-router-dom';
import Home from '../src/pages/Home';
import JobsPage from './pages/JobsPage';
//import JobDetails from './pages/JobDetails';
//import Apply from './pages/Apply';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobsPage />} />

        </Routes>
    );
};

export default App;
