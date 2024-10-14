import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Assuming you have this for styles

const Sidebar = () => {
    const role = localStorage.getItem('role'); // Get the role from local storage

    return (
        <div className="sidebar bg-light border-right shadow d-flex flex-column" style={{ width: '260px', minHeight: '100vh' }}> {/* Increased width from 250px to 260px */}
            <div className="sidebar-header d-flex align-items-center p-3" style={{ backgroundColor: '#f8f9fa', color: '#6f42c1' }}>
                <i className="bi bi-layout-sidebar-inset me-2" style={{ fontSize: '24px', color: '#6f42c1' }}></i>
                <span className="website-name h4">JNS</span>
            </div>
            <ul className="nav flex-column p-3 flex-grow-1">
                <li className="nav-item">
                    <Link to="/dashboard" className="nav-link d-flex align-items-center text-dark hover-effect">
                        <i className="bi bi-house-door-fill me-2"></i>
                        <span>Dashboard</span>
                    </Link>
                </li>

                {role === 'admin' && (
                    <li className="nav-item">
                        <Link to="/register" className="nav-link d-flex align-items-center text-dark hover-effect">
                            <i className="bi bi-person-plus-fill me-2"></i>
                            <span>Add Employee</span>
                        </Link>
                    </li>
                )}

                {role === 'employee' && (
                    <li className="nav-item">
                        <Link to="/profile" className="nav-link d-flex align-items-center text-dark hover-effect">
                            <i className="bi bi-person-circle me-2"></i>
                            <span>Profile</span>
                        </Link>
                    </li>
                )}

                {role === 'admin' && (
                    <li className="nav-item">
                        <Link to="/approve" className="nav-link d-flex align-items-center text-dark hover-effect">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            <span>Approve</span>
                        </Link>
                    </li>
                )}

                {role === 'employee' && (
                    <li className="nav-item">
                        <Link to="/skill" className="nav-link d-flex align-items-center text-dark hover-effect">
                            <i className="bi bi-plus-circle-fill me-2"></i>
                            <span>Add Skill</span>
                        </Link>
                    </li>
                )}

                {role === 'admin' && (
                    <li className="nav-item">
                        <Link to="/course" className="nav-link d-flex align-items-center text-dark hover-effect">
                            <i className="bi bi-tools me-2"></i>
                            <span>Skills Management</span>
                        </Link>
                    </li>
                )}
            </ul>
            <div className="logout-section p-3">
                <Link to="/" className="nav-link d-flex align-items-center text-danger hover-effect" onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    localStorage.removeItem('role'); // Clear role on logout
                }}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    <span>Logout</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
