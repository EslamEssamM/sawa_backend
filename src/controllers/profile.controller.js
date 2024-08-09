// controllers/profile.controller.js

const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, profileService } = require('../services');
const ApiError = require('../utils/ApiError');

/**
 * Get the current user's main profile
 */

const getMainProfile = catchAsync(async (req, res) => {
  const profile = await profileService.getMainProfileByUserId(req.user.id);
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  res.status(httpStatus.OK).send(profile);
});

// Update the current user's main profile
const updateMainProfile = catchAsync(async (req, res) => {
  const profile = await profileService.updateMainProfile(req.user.id, req.body);
  res.status(httpStatus.OK).send(profile);
});

// Public Profile Controllers

// Get another user's public profile by userId
const getPublicProfile = catchAsync(async (req, res) => {
  const publicProfile = await profileService.getPublicProfileByUserId(req.params.userId);
  if (!publicProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.status(httpStatus.OK).send(publicProfile);
});

// Friends and Social Controllers

// Get the user's friends list
const getFriendsList = catchAsync(async (req, res) => {
  const friends = await userService.getFriendsList(req.params.id);
  res.status(httpStatus.OK).send({ friends_list: friends });
});

// Get the user's followers list
const getFollowersList = catchAsync(async (req, res) => {
  const followers = await userService.getFollowersList(req.params.id);
  res.status(httpStatus.OK).send({ followers_list: followers });
});

// Get the user's following list
const getFollowingList = catchAsync(async (req, res) => {
  const following = await userService.getFollowingList(req.params.id);
  res.status(httpStatus.OK).send({ following_list: following });
});

// Get the user's blocked list
const getBlockedList = catchAsync(async (req, res) => {
  const blockedUsers = await userService.getBlockedList(req.params.id);
  res.status(httpStatus.OK).send({ blocked_list: blockedUsers });
});

// VIP Level and Subscription Controllers

// Get VIP level of a user
const getVipLevel = catchAsync(async (req, res) => {
  const vipLevel = await profileService.getVipLevel(req.params.id);
  res.status(httpStatus.OK).send({ vip_level: vipLevel });
});

// Get Pro expiration date of a user
const getProExpiration = catchAsync(async (req, res) => {
  const expirationDate = await profileService.getProExpiration(req.params.id);
  res.status(httpStatus.OK).send({ expiration_date: expirationDate });
});

// Store and Inventory Controllers

// Get store sections for the user
const getStoreSections = catchAsync(async (req, res) => {
  const storeData = await profileService.getStoreSections(req.params.id);
  res.status(httpStatus.OK).send(storeData);
});

// Get user level data
const getUserLevel = catchAsync(async (req, res) => {
  const levelData = await profileService.getUserLevel(req.params.id);
  res.status(httpStatus.OK).send(levelData);
});

// Get credits history of a user
const getCreditsHistory = catchAsync(async (req, res) => {
  const creditsHistory = await profileService.getCreditsHistory(req.params.id);
  res.status(httpStatus.OK).send(creditsHistory);
});

// Get credits agency data for a user
const getCreditsAgency = catchAsync(async (req, res) => {
  const agencyData = await profileService.getCreditsAgency(req.params.id);
  res.status(httpStatus.OK).send(agencyData);
});

// Get host agency data for a user
const getHostAgencyData = catchAsync(async (req, res) => {
  const hostAgencyData = await profileService.getHostAgencyData(req.params.id);
  res.status(httpStatus.OK).send(hostAgencyData);
});

// Social Interaction Controllers

// Follow another user
const followUser = catchAsync(async (req, res) => {
  await userService.followUser(req.user.id, req.params.userId);
  res.status(httpStatus.OK).send({ message: 'User followed successfully' });
});

// Unfollow another user
const unfollowUser = catchAsync(async (req, res) => {
  await userService.unfollowUser(req.user.id, req.params.userId);
  res.status(httpStatus.OK).send({ message: 'User unfollowed successfully' });
});

// Block another user
const blockUser = catchAsync(async (req, res) => {
  await userService.blockUser(req.user.id, req.params.userId);
  res.status(httpStatus.OK).send({ message: 'User blocked successfully' });
});

// Unblock another user
const unblockUser = catchAsync(async (req, res) => {
  await userService.unblockUser(req.user.id, req.params.userId);
  res.status(httpStatus.OK).send({ message: 'User unblocked successfully' });
});

// Join Requests and Agency Management Controllers

// Get join requests for a user
const getJoinRequests = catchAsync(async (req, res) => {
  const joinRequests = await profileService.getJoinRequests(req.params.id);
  res.status(httpStatus.OK).send({ users: joinRequests });
});

// Search Controllers

// Search users by a parameter
const searchUsers = catchAsync(async (req, res) => {
  const users = await profileService.searchUsers(req.params.param);
  res.status(httpStatus.OK).send({ search_list: users });
});

module.exports = {
  getMainProfile,
  updateMainProfile,
  getPublicProfile,
  getFriendsList,
  getFollowersList,
  getFollowingList,
  getBlockedList,
  getVipLevel,
  getProExpiration,
  getStoreSections,
  getUserLevel,
  getCreditsHistory,
  getCreditsAgency,
  getHostAgencyData,
  followUser,
  unfollowUser,
  blockUser,
  unblockUser,
  getJoinRequests,
  searchUsers,
};
