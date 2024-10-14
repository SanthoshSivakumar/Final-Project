import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';


const EmployeeDashboard = () => {
    const [skills, setSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState(null); // For editing
    const [showModal, setShowModal] = useState(false); // Modal visibility state

    // Fetch skills when component loads
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/employee/skills', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                console.log('Fetched skills:', response.data.skills); // Log fetched data
                setSkills(response.data.skills);
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };
        fetchSkills();
    }, []);
    

    // Handle opening the modal for editing
    const handleEditSkill = (index) => {
        const skill = skills[index];
        setSelectedSkill({ ...skill, index }); // Store skill data and index
        setShowModal(true); // Show modal
    };

    // Handle saving the edited skill
    const handleSaveChanges = async () => {
        try {
            const response = await axios.put('http://localhost:5000/api/employee/skills', {
                skillIndex: selectedSkill.index,
                skillname: selectedSkill.skillname,
                coursename: selectedSkill.coursename,
                certificate_link: selectedSkill.certificate_link,
                score: selectedSkill.score
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // Update the local state
            setSkills(response.data.skills);
            setShowModal(false); // Hide modal
        } catch (error) {
            console.error('Error updating skill:', error);
        }
    };

    // Handle deleting a skill
    const handleDeleteSkill = async (index) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/employee/skills/${index}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSkills(response.data.skills); // Update state after deletion
        } catch (error) {
            console.error('Error deleting skill:', error);
        }
    };

    return (
        <div>
            <h1>Employee Dashboard</h1>
            <p>Your skills</p>
            <table className="table">
                <thead>
                    <tr>
                        <th>Skill Name</th>
                        <th>Course Name</th>
                        <th>Certificate Link</th>
                        <th>Score</th>
                        <th>Approval</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {skills.map((skill, index) => (
                        <tr key={index}>
                            <td>{skill.skillname}</td>
                            <td>{skill.coursename}</td>
                            <td><a href={skill.certificate_link} target="_blank" rel="noopener noreferrer">View</a></td>
                            <td>{skill.score}/100</td>
                            <td>{skill.approval === null ? 'Pending' : skill.approval ? 'Approved' : 'Rejected'}</td>
                            <td>
    <button className="btn btn-primary" onClick={() => handleEditSkill(index)}>
        Edit
    </button>
    <button className="btn btn-danger ms-2" onClick={() => handleDeleteSkill(index)}>
        Delete
    </button>
</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            

            {/* Bootstrap Modal for editing skills */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Skill</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Skill Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Skill Name"
                            value={selectedSkill?.skillname}
                            onChange={(e) => setSelectedSkill({ ...selectedSkill, skillname: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Course Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Course Name"
                            value={selectedSkill?.coursename}
                            onChange={(e) => setSelectedSkill({ ...selectedSkill, coursename: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Certificate Link</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Certificate Link"
                            value={selectedSkill?.certificate_link}
                            onChange={(e) => setSelectedSkill({ ...selectedSkill, certificate_link: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Score</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Score"
                            value={selectedSkill?.score}
                            onChange={(e) => setSelectedSkill({ ...selectedSkill, score: e.target.value })}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EmployeeDashboard;
