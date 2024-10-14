import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
const ApprovalTable = () => {
    const [pendingSkills, setPendingSkills] = useState([]);

    const getPendingSkills = async () => {
        const res = await axios.get(`http://localhost:5000/api/admin/pending-skills`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
        setPendingSkills(res.data);
    };

    useEffect(() => {
        getPendingSkills();
    }, []);

    const handleApproval = async (skillId) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/approve-skill/${skillId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Refresh the pending skills list
            // let temp = pendingSkills.filter(emp => emp.id !== skillId)
            // setPendingSkills(temp);
            getPendingSkills()
        } catch (error) {
            console.error('Error approving skill:', error);
        }
    };

    const handleRejection = async (skillId) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/reject-skill/${skillId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Refresh the pending skills list
            getPendingSkills()
            // setPendingSkills(pendingSkills.filter(emp => emp.id !== skillId));
        } catch (error) {
            console.error('Error rejecting skill:', error);
        }
    };

    return (
        <Layout>
            <div>
            <h1>Approval Table</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Skill Name</th>
                        <th>Course Name</th>
                        <th>Score</th>
                        <th>Certificate Link</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    {pendingSkills.length > 0 ? (
        pendingSkills.map(emp => (
            emp && emp.skills.filter(skill => skill.approval === null).map((skill, skillIndex) => (
                <tr key={`${emp.id}-${skillIndex}`}>
                    <td>{emp.email}</td>
                    <td>{skill.skillname}</td>
                    <td>{skill.coursename}</td>
                    <td>{skill.score}</td>
                    <td>
                        <a href={skill.certificate_link} target="_blank" rel="noopener noreferrer">
                            View
                        </a>
                    </td>
                    <td>
                        <button className="btn btn-primary" onClick={() => handleApproval(skill._id)}>Approve</button>
                        <button className="btn btn-danger" onClick={() => handleRejection(skill._id)}>Reject</button>
                    </td>
                </tr>
            ))
        ))
    ) : (
        <tr>
            <td colSpan="6">No pending skills found.</td>
        </tr>
    )}
</tbody>

            </table>
        </div>
        </Layout>
        
    );
};

export default ApprovalTable;
