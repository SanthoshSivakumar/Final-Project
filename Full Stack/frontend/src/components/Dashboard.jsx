// src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import Layout from './Layout';
import AdminDashboard from './AdminDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const role = localStorage.getItem('role');

    return (
        <Layout>
            <Container fluid className="p-2"> {/* Reduced padding */}
                
                <Row>
                    <Col xs={12} className="p-0"> {/* Remove padding on the column */}
                        {role === 'admin' ? (
                            <AdminDashboard />
                        ) : (
                            <EmployeeDashboard />
                        )}
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default Dashboard;
