// services/user.service.js

const User = require('../models/user.model');
const Profile = require('../models/profile.model');
const { generateUniqueUserId } = require('../utils/IDGen');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

/**
 * Create a new user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new Error('Email already taken');
  }

  // Generate a unique 10-digit user ID
  const userId = await generateUniqueUserId();

  // Assign the generated user ID to the new user
  const user = await User.create({ ...userBody, userId });

  // Create a corresponding profile for the new user
  await Profile.create({ userId: user._id });

  return user;
};

/**
 * Get user by MongoDB ID
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id).populate('groups').populate('hostAgency');
};

/**
 * Update user by userId
 * @param {string} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by userId
 * @param {string} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * Follow a user
 * @param {string} userId - ID of the user who is following
 * @param {string} targetUserId - ID of the user to be followed
 * @returns {Promise<void>}
 */
const followUser = async (userId, targetUserId) => {
  const user = await User.findOne({ userId });
  const targetUser = await User.findOne({ userId: targetUserId });

  if (!user || !targetUser) {
    throw new Error('User not found');
  }

  if (!user.following.includes(targetUser._id)) {
    user.following.push(targetUser._id);
    targetUser.followers.push(user._id);

    await user.save();
    await targetUser.save();
  }
};

/**
 * Unfollow a user
 * @param {string} userId - ID of the user who is unfollowing
 * @param {string} targetUserId - ID of the user to be unfollowed
 * @returns {Promise<void>}
 */
const unfollowUser = async (userId, targetUserId) => {
  const user = await User.findOne({ userId });
  const targetUser = await User.findOne({ userId: targetUserId });

  if (!user || !targetUser) {
    throw new Error('User not found');
  }

  user.following = user.following.filter((id) => id.toString() !== targetUser._id.toString());
  targetUser.followers = targetUser.followers.filter((id) => id.toString() !== user._id.toString());

  await user.save();
  await targetUser.save();
};

/**
 * Block a user
 * @param {string} userId - ID of the user who is blocking
 * @param {string} targetUserId - ID of the user to be blocked
 * @returns {Promise<void>}
 */
const blockUser = async (userId, targetUserId) => {
  const user = await User.findOne({ userId });
  const targetUser = await User.findOne({ userId: targetUserId });

  if (!user || !targetUser) {
    throw new Error('User not found');
  }

  if (!user.blockedUsers.includes(targetUser._id)) {
    user.blockedUsers.push(targetUser._id);
    await user.save();
  }
};

/**
 * Unblock a user
 * @param {string} userId - ID of the user who is unblocking
 * @param {string} targetUserId - ID of the user to be unblocked
 * @returns {Promise<void>}
 */
const unblockUser = async (userId, targetUserId) => {
  const user = await User.findOne({ userId });
  const targetUser = await User.findOne({ userId: targetUserId });

  if (!user || !targetUser) {
    throw new Error('User not found');
  }

  user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== targetUser._id.toString());
  await user.save();
};

/**
 * Get a user's followers list by userId
 * @param {string} userId
 * @returns {Promise<Array<User>>}
 */
const getFollowersList = async (userId) => {
  const user = await User.findOne({ userId }).populate('followers', 'username avatar level credits');
  return user ? user.followers : [];
};

/**
 * Get a user's following list by userId
 * @param {string} userId
 * @returns {Promise<Array<User>>}
 */
const getFollowingList = async (userId) => {
  const user = await User.findOne({ userId }).populate('following', 'username avatar level credits');
  return user ? user.following : [];
};

/**
 * Search users by name or userId
 * @param {String} query - Search query (name or userId)
 * @returns {Promise<User[]>}
 */
const searchUsers = async (query, page = 1, limit = 10) => {
  if (!query) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Search query is required');
  }
  const searchRegex = new RegExp(query, 'i');
  const users = await User.find({
    $or: [{ name: searchRegex }, { userId: query }],
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
  const totalResults = await User.countDocuments({
    $or: [{ name: searchRegex }, { userId: query }],
  });
  return {
    users,
    totalResults,
    currentPage: page,
    totalPages: Math.ceil(totalResults / limit),
  };
};

module.exports = {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  searchUsers,
  followUser,
  unfollowUser,
  blockUser,
  unblockUser,
  getFollowersList,
  getFollowingList,
};
