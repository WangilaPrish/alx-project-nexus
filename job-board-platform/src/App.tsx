import { Routes, Route } from 'react-router-dom';
import Home from '../src/pages/Home';
//import JobDetails from './pages/JobDetails';
//import Apply from './pages/Apply';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

        </Routes>
    );
};

export default App;
