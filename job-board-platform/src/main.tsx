import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/styles/global.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/NavBar';
import HeroSection from './components/HeroSection';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>

            <Navbar />
            <HeroSection />

        </BrowserRouter>
    </React.StrictMode>
);
