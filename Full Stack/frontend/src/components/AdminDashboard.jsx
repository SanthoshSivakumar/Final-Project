import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const [employeeSkills, setEmployeeSkills] = useState([]);
    const [skills, setSkills] = useState([]);
    const [courses, setCourses] = useState([]);
    const [skillChartData, setSkillChartData] = useState(null);
    const [courseChartData, setCourseChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedSkill, setSelectedSkill] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchSkills(), fetchCourses()]);
            await fetchEmployeeSkills();
            setLoading(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (employeeSkills.length && skills.length) processSkillChartData(employeeSkills);
        if (employeeSkills.length && courses.length) processCourseChartData(employeeSkills);
    }, [employeeSkills, skills, courses]);

    const fetchEmployeeSkills = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/approved-skills', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setEmployeeSkills(response.data);
        } catch (error) {
            console.error('Error fetching employee skills:', error);
        }
    };

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

    const processSkillChartData = (data) => {
        const skillCount = {};
        data.forEach((employee) => {
            employee.skills.forEach((skill) => {
                if (skills.includes(skill.skillname)) {
                    skillCount[skill.skillname] = (skillCount[skill.skillname] || 0) + 1;
                }
            });
        });

        const labels = Object.keys(skillCount);
        const counts = Object.values(skillCount);

        setSkillChartData({
            labels,
            datasets: [
                {
                    label: 'Number of Employees with Skill',
                    data: counts,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        });
    };

    const processCourseChartData = (data) => {
        const courseCount = {};
        data.forEach((employee) => {
            employee.skills.forEach((skill) => {
                if (courses.includes(skill.coursename)) {
                    courseCount[skill.coursename] = (courseCount[skill.coursename] || 0) + 1;
                }
            });
        });

        const labels = Object.keys(courseCount);
        const counts = Object.values(courseCount);

        setCourseChartData({
            labels,
            datasets: [
                {
                    label: 'Number of Employees with Course',
                    data: counts,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }
            ]
        });
    };

    const viewSkill = (employee) => {
        setSelectedEmployee(employee);
        setShowModal(true);
    };

    const handleSkillFilterChange = (e) => {
        setSelectedSkill(e.target.value);
    };

    const handleCourseFilterChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    const filteredEmployees = employeeSkills.filter((employee) =>
        (selectedSkill === '' || employee.skills.some((skill) => skill.skillname === selectedSkill)) &&
        (selectedCourse === '' || employee.skills.some((skill) => skill.coursename === selectedCourse))
    );

    const totalEmployees = employeeSkills.length;
    const totalSkills = skills.length;
    const totalCourses = courses.length;

    return (
        <div className="bg-light text-dark p-4">
            <h1 style={{ color: '#6f42c1', textAlign: 'center' }}>Admin Dashboard</h1>
            <p style={{ color: '#6f42c1', textAlign: 'center' }}>Manage employee skills</p>
            
            {loading ? (
                <p>Loading data, please wait...</p>
            ) : (
                <>
                    <Row className="mb-4">
                        <Col md={4}>
                            <Card className="bg-light text-dark">
                                <Card.Body>
                                    <Card.Title>Total Employees</Card.Title>
                                    <Card.Text>{totalEmployees}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="bg-light text-dark">
                                <Card.Body>
                                    <Card.Title>Total Skills</Card.Title>
                                    <Card.Text>{totalSkills}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="bg-light text-dark">
                                <Card.Body>
                                    <Card.Title>Total Courses</Card.Title>
                                    <Card.Text>{totalCourses}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label style={{ color: '#6f42c1' }}>Filter by Skill</Form.Label>
                                <Form.Control as="select" value={selectedSkill} onChange={handleSkillFilterChange}>
                                    <option value="">All Skills</option>
                                    {skills.map((skill, index) => (
                                        <option key={index} value={skill}>{skill}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label style={{ color: '#6f42c1' }}>Filter by Course</Form.Label>
                                <Form.Control as="select" value={selectedCourse} onChange={handleCourseFilterChange}>
                                    <option value="">All Courses</option>
                                    {courses.map((course, index) => (
                                        <option key={index} value={course}>{course}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <table className="table table-striped text-dark">
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Email</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.email.split('@')[0]}</td>
                                    <td>{employee.email}</td>
                                    <td><button className="btn btn-light" onClick={() => viewSkill(employee)}>View</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedEmployee ? selectedEmployee.email.split('@')[0] : ''}'s Skills</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedEmployee && (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Skill Name</th>
                                            <th>Course Name</th>
                                            <th>Certificate Link</th>
                                            <th>Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedEmployee.skills.map((skill, index) => (
                                            <tr key={index}>
                                                <td>{skill.skillname}</td>
                                                <td>{skill.coursename}</td>
                                                <td><a href={skill.certificate_link} target="_blank" rel="noopener noreferrer">View Certificate</a></td>
                                                <td>{skill.score}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {skillChartData && (
                        <div>
                            <h2 style={{ color: '#6f42c1', textAlign: 'center' }}>Skills Distribution</h2>
                            <Bar data={skillChartData} options={{ responsive: true }} />
                        </div>
                    )}

                    {courseChartData && (
                        <div>
                            <h2 style={{ color: '#6f42c1', textAlign: 'center' }}>Courses Distribution</h2>
                            <Bar data={courseChartData} options={{ responsive: true }} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
