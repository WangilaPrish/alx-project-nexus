import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../src/styles/global.css';
import App from './App';
import Footer from './components/common/Footer';
import Navbar from './components/common/NavBar';
import { AppliedJobsProvider } from './context/AppliedJobsContext';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';


const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <AuthProvider>
                <AppliedJobsProvider>
                    <BrowserRouter>
                        <JobProvider>
                            <Navbar />

                            <App />
                            <Footer />
                        </JobProvider>
                    </BrowserRouter>
                </AppliedJobsProvider>
            </AuthProvider>
        </React.StrictMode>
    );
} else {
    throw new Error("Root element not found");
}
