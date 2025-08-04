import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/styles/global.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/common/NavBar';
import Footer from './components/common/Footer';
import App from './App';
import { JobProvider } from './context/JobContext';



const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <BrowserRouter>
                <JobProvider>
                    <Navbar />

                    <App />
                    <Footer />
                </JobProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
} else {
    throw new Error("Root element not found");
}
