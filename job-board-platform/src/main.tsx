import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../src/styles/global.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/NavBar';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>

            <Navbar />

        </BrowserRouter>
    </React.StrictMode>
);
