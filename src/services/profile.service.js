// services/profile.service.js

const Profile = require('../models/profile.model');
const User = require('../models/user.model');

/**
 * Get a user's main profile by userId
 * @param {ObjectId} userId
 * @returns {Promise<Profile>}
 */
const getMainProfileByUserId = async (userId) => {
  return Profile.findOne({ userId }).populate('userId', 'username email avatar credits level vipLevel');
};

/**
 * Update a user's main profile
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<Profile>}
 */
const updateMainProfile = async (userId, updateBody) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new Error('Profile not found');
  }
  Object.assign(profile, updateBody);
  await profile.save();
  return profile;
};

/**
 * Add a product to the user's store section
 * @param {ObjectId} userId
 * @param {String} sectionName
 * @param {Object} product
 * @returns {Promise<Profile>}
 */
const addProductToStore = async (userId, sectionName, product) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new Error('Profile not found');
  }
  await profile.addProductToStore(sectionName, product);
  return profile;
};

/**
 * Add a product to the user's bag
 * @param {ObjectId} userId
 * @param {String} sectionName
 * @param {Object} product
 * @returns {Promise<Profile>}
 */
const addProductToBag = async (userId, sectionName, product) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new Error('Profile not found');
  }
  await profile.addProductToBag(sectionName, product);
  return profile;
};

/**
 * Add a user to an agency's user list
 * @param {ObjectId} userId
 * @param {Object} userDetails
 * @returns {Promise<Profile>}
 */
const addUserToAgency = async (userId, userDetails) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new Error('Profile not found');
  }
  await profile.addUserToAgency(userId, userDetails);
  return profile;
};

/**
 * Update host agency data for a user
 * @param {ObjectId} userId
 * @param {Object} hostData
 * @returns {Promise<Profile>}
 */
const updateHostAgencyData = async (userId, hostData) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new Error('Profile not found');
  }
  await profile.updateHostAgencyData(hostData);
  return profile;
};

/**
 * Get a public profile by userId
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const getPublicProfileByUserId = async (userId) => {
  return User.findById(userId).select('username avatar level credits charisma country');
};

/**
 * Get the current user's friends list
 * @param {ObjectId} userId
 * @returns {Promise<Array<User>>}
 */
const getFriendsList = async (userId) => {
  const user = await User.findById(userId).populate('friends', 'username avatar level credits');
  return user ? user.friends : [];
};

/**
 * Get the current user's followers list
 * @param {ObjectId} userId
 * @returns {Promise<Array<User>>}
 */
const getFollowersList = async (userId) => {
  const user = await User.findById(userId).populate('followers', 'username avatar level credits');
  return user ? user.followers : [];
};

/**
 * Get the current user's following list
 * @param {ObjectId} userId
 * @returns {Promise<Array<User>>}
 */
const getFollowingList = async (userId) => {
  const user = await User.findById(userId).populate('following', 'username avatar level credits');
  return user ? user.following : [];
};

const getVipLevel = async (userId) => {
  const profile = await Profile.findOne({ userId });
  return profile ? profile.vipLevel : null;
};

const getProExpiration = async (userId) => {
  const profile = await Profile.findOne({ userId });
  return profile ? profile.proExpirationDate : null;
};


module.exports = {
  getMainProfileByUserId,
  updateMainProfile,
  addProductToStore,
  addProductToBag,
  addUserToAgency,
  updateHostAgencyData,
  getPublicProfileByUserId,
  getFriendsList,
  getFollowersList,
  getFollowingList,
  getVipLevel,
  getProExpiration,
};
