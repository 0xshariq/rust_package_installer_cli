import express from 'express';
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  searchUsers
} from '../controllers/user.controller.js';
import { validateUserData } from '../middleware/validation.js';

const router = express.Router();

// @route   POST /api/users
// @desc    Create a new user
// @access  Public
router.post('/', validateUserData, createUser);

// @route   GET /api/users
// @desc    Get all users with pagination
// @access  Public
router.get('/', getUsers);

// @route   GET /api/users/search
// @desc    Search users by name or email
// @access  Public
router.get('/search', searchUsers);

// @route   GET /api/users/:id
// @desc    Get single user by ID
// @access  Public
router.get('/:id', getUser);

// @route   PUT /api/users/:id
// @desc    Update user by ID
// @access  Public
router.put('/:id', validateUserData, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user by ID
// @access  Public
router.delete('/:id', deleteUser);

export default router; 