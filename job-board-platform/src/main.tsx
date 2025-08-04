import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/styles/global.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/common/NavBar';
import Footer from './components/common/Footer';
import App from './App';
import { JobProvider } from './context/JobContext';
import { AuthProvider } from './context/AuthContext';


const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <AuthProvider>

                <BrowserRouter>
                    <JobProvider>
                        <Navbar />

                        <App />
                        <Footer />
                    </JobProvider>
                </BrowserRouter>
            </AuthProvider>
        </React.StrictMode>
    );
} else {
    throw new Error("Root element not found");
}
