import { Routes, Route } from 'react-router-dom';
import Home from '../src/pages/Home';
//import JobDetails from './pages/JobDetails';
//import Apply from './pages/Apply';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            //*<Route path="/jobs/:id" element={<JobDetails />} />*//
            //*<Route path="/apply/:id" element={<Apply />} />*//
        </Routes>
    );
};

export default App;
