import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout';

const AdminSkillManager = () => {
    const [skills, setSkills] = useState([]);
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const fetchSkills = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employee/skillname', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSkills(response.data);
        } catch (error) {
            setError('Error fetching skills');
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employee/coursename', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCourses(response.data);
        } catch (error) {
            setError('Error fetching courses');
        }
    };

    useEffect(() => {
        fetchSkills();
        fetchCourses();
    }, []);

    const handleAddSkill = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            const response = await axios.post('http://localhost:5000/api/employee/skillname', { skillname: newSkill },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setSkills([...skills, response.data.skill]);
            setSuccess('Skill added successfully');
            setNewSkill('');
        } catch (error) {
            setError('Error adding skill');
        } finally {
            setIsAdding(false);
            resetMessages();
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            const response = await axios.post('http://localhost:5000/api/employee/coursename', { coursename: newCourse },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setCourses([...courses, response.data.course]);
            setSuccess('Course added successfully');
            setNewCourse('');
        } catch (error) {
            setError('Error adding course');
        } finally {
            setIsAdding(false);
            resetMessages();
        }
    };

    const handleDeleteSkill = async (skillId) => {
        try {
            await axios.delete(`http://localhost:5000/api/employee/skillname/${skillId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSkills(prevSkills => prevSkills.filter(skill => skill._id !== skillId));
            setSuccess('Skill deleted successfully');
        } catch (error) {
            setError('Error deleting skill');
        } finally {
            resetMessages();
        }
    };

    const handleDeleteCourse = async (courseId) => {
        try {
            await axios.delete(`http://localhost:5000/api/employee/coursename/${courseId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
            setSuccess('Course deleted successfully');
        } catch (error) {
            setError('Error deleting course');
        } finally {
            resetMessages();
        }
    };

    const resetMessages = () => {
        setTimeout(() => {
            setSuccess('');
            setError('');
        }, 3000);
    };

    return (
        <Layout>
            <div className="container mt-4">
                <h2>Admin Skill Manager</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="row mb-3">
                    <div className="col-md-6">
                        <form onSubmit={handleAddSkill}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Add new skill"
                                    className="form-control"
                                    required
                                    disabled={isAdding}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isAdding || newSkill.trim() === ''}
                                >
                                    {isAdding ? 'Adding...' : 'Add Skill'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="col-md-6">
                        <form onSubmit={handleAddCourse}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={newCourse}
                                    onChange={(e) => setNewCourse(e.target.value)}
                                    placeholder="Add new course"
                                    className="form-control"
                                    required
                                    disabled={isAdding}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isAdding || newCourse.trim() === ''}
                                >
                                    {isAdding ? 'Adding...' : 'Add Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div>
                    <h2>Skills</h2>
                    {loading ? (
                        <p>Loading skills...</p>
                    ) : (
                        <ul className="list-group">
                            {skills.map(skill => (
                                <li key={skill._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {skill.skillname}
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteSkill(skill._id)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className='mt-3'>
                    <h2>Courses</h2>
                    {loading ? (
                        <p>Loading courses...</p>
                    ) : (
                        <ul className="list-group mt-3">
                            {courses.map(course => (
                                <li key={course._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {course.coursename}
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteCourse(course._id)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AdminSkillManager;
