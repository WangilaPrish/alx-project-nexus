import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/styles/global.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/NavBar';
import App from './App';
import { JobProvider } from './context/JobContext';
import HeroSection from './components/HeroSection';

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <BrowserRouter>
                <JobProvider>
                    <Navbar />
                    <HeroSection />
                    <App />
                </JobProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
} else {
    throw new Error("Root element not found");
}
