// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import Layout from './Layout'; // Import the Layout component
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to the login page if there is no token
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const username = localStorage.getItem('username');

    return (
        <Layout>
            <div className="container text-center my-5">
                <h1 className="display-4 text-primary">Welcome, {username}</h1>
                <p className="lead text-muted">This is the home page of your app.</p>
                <p className="mt-4">Feel free to navigate through the sidebar to explore the features.</p>
            </div>
        </Layout>
    );
};

export default HomePage;
