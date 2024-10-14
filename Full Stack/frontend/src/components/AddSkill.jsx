import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const AddSkill = () => {
    const [newSkill, setNewSkill] = useState({ skillname: '', coursename: '', certificate_link: '', score: '' });
    const [skills, setSkills] = useState([]);
    const [courses, setCourses] = useState([]);
    // Fetch skills from the backend
    const fetchSkills = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employee/skillname', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const skillNames = response.data.map(skill => skill.skillname);
            setSkills(skillNames);
        } catch (error) {
            console.error('Error fetching skills', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employee/coursename', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const courseNames = response.data.map(course => course.coursename);
            setCourses(courseNames);
        } catch (error) {
            console.error('Error fetching courses', error);
        }
    };

    useEffect(() => {
        fetchSkills();
        fetchCourses();
    }, []);

    // Handle adding a new skill
    const handleAddSkill = async () => {
        const score = parseInt(newSkill.score, 10);
        
        if (!newSkill.skillname || !newSkill.coursename || !newSkill.certificate_link || !newSkill.score) {
            toast.error('Please fill all fields before adding a skill.'); // Show error toast
            return;
        }

        if (score < 0 || score > 100) {
            toast.error('Score must be between 0 and 100.'); // Show error toast if score is out of range
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found. Please log in.');
            }

            // Sending the new skill object to the backend
            await axios.post('http://localhost:5000/api/employee/skills',
                {
                    skillname: newSkill.skillname,
                    coursename: newSkill.coursename,
                    certificate_link: newSkill.certificate_link,
                    score: newSkill.score
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Skill added successfully!'); // Show success toast
            setNewSkill({ skillname: '', coursename: '', certificate_link: '', score: '' }); // Clear the input fields
        } catch (error) {
            console.error('Error adding skill:', error.response ? error.response.data : error.message);
            toast.error('Failed to add skill. Please try again.'); // Show error toast
        }
    };

    return (
        <Layout>
            <Container className="mt-4">
                <h1 className="mb-4">Add Skill</h1>
                <Form>
                    {/* Dropdown for Skill Name */}
                    <Form.Group as={Row} controlId="formSkillName">
                        <Form.Label column sm={2}>Skill Name</Form.Label>
                        <Col sm={10}>
                            <Form.Select
                                value={newSkill.skillname}
                                onChange={(e) => setNewSkill({ ...newSkill, skillname: e.target.value })}
                                required
                            >
                                <option value="">Select Skill Name</option>
                                {/* Render dropdown options dynamically from `skills` state */}
                                {skills.map((skill, index) => (
                                    <option key={index} value={skill}>
                                        {skill}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Form.Group>

                    {/* Other input fields */}
                    <Form.Group as={Row} controlId="formCourseName">
                        <Form.Label column sm={2}>Course Name</Form.Label>
                        <Col sm={10}>
                            <Form.Select
                                value={newSkill.coursename}
                                onChange={(e) => setNewSkill({  ...newSkill, coursename: e.target.value })}
                                required
                            >
                                <option value="">Select course Name</option>
                                {/* Render dropdown options dynamically from `skills` state */}
                                {courses.map((course, index) => (
                                    <option key={index} value={course}>
                                        {course}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formCertificateLink">
                        <Form.Label column sm={2}>Certificate Link</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Enter Certificate Link"
                                value={newSkill.certificate_link}
                                onChange={(e) => setNewSkill({ ...newSkill, certificate_link: e.target.value })}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formScore">
                        <Form.Label column sm={2}>Score</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="number"
                                placeholder="Enter Score"
                                min="0"
                                max="100"
                                value={newSkill.score}
                                onChange={(e) => setNewSkill({ ...newSkill, score: e.target.value })}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button variant="success" onClick={handleAddSkill}>
                                Add Skill
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>

                {/* Toast Container to display toasts */}
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            </Container>
        </Layout>
    );
};

export default AddSkill;
