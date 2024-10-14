const Skill = require('../models/Skill');
const User = require('../models/User');

// Controller to get all employees and their skills
exports.getAllEmployeeSkills = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }

    try {
        const employeeSkills = await Skill.find().populate('userId', 'name email');

        if (!employeeSkills) {
            return res.status(404).json({ message: 'No employee skills found' });
        }

        const formattedEmployeeSkills = employeeSkills.map(emp => ({
            id: emp.userId._id,
            name: emp.userId.name,
            email: emp.userId.email,
            skills: emp.skills.map(skill => ({ skillname: skill.skillname }))
        }));

        res.json(formattedEmployeeSkills);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.getPendingSkills = async (req, res) => {
    try {
        const employees = await Skill.find({ 'skills.approval': null })
            .populate('userId', 'email')
            .select('skills userId');

        if (!employees || employees.length === 0) {
            return res.status(200).send([]);
        }

        const pendingSkills = employees.map(employee => {
            if (!employee.userId) {
                return null; // Skip if userId is null
            }
            return {
                email: employee.userId.email,
                skills: employee.skills.filter(skill => skill.approval === null)
            };
        }).filter(emp => emp !== null); // Remove null entries

        res.json(pendingSkills);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Controller to approve a skill
exports.approveSkill = async (req, res) => {
    const { skillId } = req.params;

    try {
        const skill = await Skill.findOneAndUpdate(
            { 'skills._id': skillId },
            { $set: { 'skills.$.approval': true } },
            { new: true }
        );

        if (!skill) {
            return res.status(404).send('Skill not found');
        }

        res.send('Skill approved');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Controller to reject a skill
exports.rejectSkill = async (req, res) => {
    const { skillId } = req.params;

    try {
        const skill = await Skill.findOneAndUpdate(
            { 'skills._id': skillId },
            { $set: { 'skills.$.approval': false } },
            { new: true }
        );

        if (!skill) {
            return res.status(404).send('Skill not found');
        }

        res.send('Skill rejected');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.getApprovedSkills = async (req, res) => {
    try {
        const employees = await Skill.find({ 'skills.approval': true })
            .populate('userId', 'email')
            .select('skills userId');

        if (!employees || employees.length === 0) {
            return res.status(200).send([]);
        }

        const approvedSkills = employees.map(employee => {
            if (!employee.userId) {
                return null; // Skip if userId is null
            }
            return {
                email: employee.userId.email,
                skills: employee.skills.filter(skill => skill.approval === true)
            };
        }).filter(emp => emp !== null);

        res.json(approvedSkills);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
