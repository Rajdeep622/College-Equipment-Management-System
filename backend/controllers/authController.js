const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'college_management_system_jwt_secret_key_2026_secure', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, studentId, email, phone, address, password, department, semester } = req.body;

    const existingStudentId = await User.findOne({ studentId: studentId.toUpperCase() });
    if (existingStudentId) {
      return res.status(400).json({
        success: false,
        message: `Student ID / Roll Number '${studentId}' is already registered.`
      });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: `Email address '${email}' is already registered.`
      });
    }

    const user = await User.create({
      name,
      studentId: studentId.toUpperCase(),
      email: email.toLowerCase(),
      phone,
      address,
      passwordHash: password, // Pre-save hook hashes passwordHash
      role: 'student',
      department: department || 'Computer Engineering',
      semester: semester || '4th Semester'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token,
      data: {
        _id: user._id,
        studentId: user.studentId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        department: user.department,
        semester: user.semester,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate student/admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { studentId, password } = req.body;

    const user = await User.findOne({ studentId: studentId.toUpperCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Student ID / Roll Number or User not registered.'
      });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact campus administrator.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect Password. Please try again.'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      data: {
        _id: user._id,
        studentId: user.studentId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        department: user.department,
        semester: user.semester,
        avatar: user.avatar,
        status: user.status,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.department = req.body.department || user.department;
    user.semester = req.body.semester || user.semester;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.password && req.body.password.length >= 6) {
      user.passwordHash = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        studentId: updatedUser.studentId,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        department: updatedUser.department,
        semester: updatedUser.semester,
        avatar: updatedUser.avatar,
        status: updatedUser.status
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};
