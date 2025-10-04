import User from '../models/user.model.js';
import { asyncHandler, CustomError } from '../middleware/errorHandler.js';

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
export const createUser = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new CustomError('User with this email already exists', 400);
  }

  const user = await User.create({
    name,
    email: email.toLowerCase()
  });

  const response = {
    success: true,
    message: 'User created successfully',
    data: user
  };

  res.status(201).json(response);
});

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-__v');

  const total = await User.countDocuments();

  const response = {
    success: true,
    message: 'Users retrieved successfully',
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  };

  res.status(200).json(response);
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-__v');

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const response = {
    success: true,
    message: 'User retrieved successfully',
    data: user
  };

  res.status(200).json(response);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
export const updateUser = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  // Check if email is being updated and if it already exists
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new CustomError('User with this email already exists', 400);
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: name || user.name,
      email: email ? email.toLowerCase() : user.email
    },
    {
      new: true,
      runValidators: true
    }
  ).select('-__v');

  const response = {
    success: true,
    message: 'User updated successfully',
    data: updatedUser
  };

  res.status(200).json(response);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  await User.findByIdAndDelete(req.params.id);

  const response = {
    success: true,
    message: 'User deleted successfully'
  };

  res.status(200).json(response);
});

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
export const searchUsers = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    throw new CustomError('Search query is required', 400);
  }

  const users = await User.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ]
  }).select('-__v');

  const response = {
    success: true,
    message: 'Search completed successfully',
    data: users
  };

  res.status(200).json(response);
}); 