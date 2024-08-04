const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
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
 * Delete user by id
 * @param {ObjectId} userId
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
const getMainProfile = async (userId) => {
  return User.findById(userId).select(
    'avatar frame name id country friends followers following level credits is_host host_agency credits_agency'
  );
};

const getFriendsList = async (userId) => {
  const user = await User.findById(userId).populate(
    'friends',
    'id name avatar frame followers following level charge_level carizma gender age'
  );
  return user.friends;
};

const getFollowersList = async (userId) => {
  const user = await User.findById(userId).populate(
    'followers',
    'id name avatar frame followers following level charge_level carizma gender age'
  );
  return user.followers;
};

const getFollowingList = async (userId) => {
  const user = await User.findById(userId).populate(
    'following',
    'id name avatar frame followers following level charge_level carizma gender age'
  );
  return user.following;
};

const getBlockedList = async (userId) => {
  const user = await User.findById(userId).populate(
    'blockedUsers',
    'id name avatar frame followers following level charge_level carizma gender age'
  );
  return user.blockedUsers;
};

const searchUsers = async (param) => {
  return User.find({ name: new RegExp(param, 'i') }).select(
    'id name avatar frame level charge_level carizma gender age in_room'
  );
};

const getVipLevel = async (userId) => {
  const user = await User.findById(userId).select('vip_level');
  return user.vip_level;
};

const getProExpiration = async (userId) => {
  const user = await User.findById(userId).select('pro_expiration_date');
  return user.pro_expiration_date;
};

const getStoreSections = async (userId) => {
  // Assuming you have a Store model or similar logic
  // return store sections for the user
};

const getUserLevel = async (userId) => {
  const user = await User.findById(userId).select('level next_level_points');
  return user;
};

const getCreditsHistory = async (userId) => {
  const user = await User.findById(userId).select('credits history');
  return user.history;
};

const getCreditsAgency = async (userId) => {
  // Fetch and return credits agency data
};

const getHostAgencyData = async (userId) => {
  // Fetch and return host agency data
};

const getJoinRequests = async (userId) => {
  // Fetch and return join requests for the user's host agency
};

// Additional service functions will follow a similar pattern...

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getMainProfile,
  getFriendsList,
  getFollowersList,
  getFollowingList,
  getBlockedList,
  searchUsers,
  getVipLevel,
  getProExpiration,
  getStoreSections,
  getUserLevel,
  getCreditsHistory,
  getCreditsAgency,
  getHostAgencyData,
  getJoinRequests,
};
