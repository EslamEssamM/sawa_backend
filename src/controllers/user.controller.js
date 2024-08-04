const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

// Create a new user
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

// Get all users with filtering and pagination
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

// Get a single user by ID
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

// Update a user's information by ID
const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

// Delete a user by ID
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

// View the authenticated user's profile
const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

// Update the authenticated user's profile
const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user.id, req.body);
  res.send(user);
});

// Add a friend to the user's friends list
const addFriend = catchAsync(async (req, res) => {
  const user = await userService.addFriend(req.user.id, req.params.friendId);
  res.send(user);
});

// Follow or unfollow another user
const followUser = catchAsync(async (req, res) => {
  const result = await userService.toggleFollow(req.user.id, req.params.userId);
  res.send(result);
});

// Add or deduct credits for the user
const manageCredits = catchAsync(async (req, res) => {
  const { type, amount } = req.body;
  const user = await userService.manageCredits(req.user.id, type, amount);
  res.send(user);
});

const getMainProfile = catchAsync(async (req, res) => {
  const user = await userService.getMainProfile(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const getFriendsList = catchAsync(async (req, res) => {
  const friends = await userService.getFriendsList(req.params.id);
  res.send({ friends_list: friends });
});

const getFollowersList = catchAsync(async (req, res) => {
  const followers = await userService.getFollowersList(req.params.id);
  res.send({ followers_list: followers });
});

const getFollowingList = catchAsync(async (req, res) => {
  const following = await userService.getFollowingList(req.params.id);
  res.send({ following_list: following });
});

const getBlockedList = catchAsync(async (req, res) => {
  const blockedUsers = await userService.getBlockedList(req.params.id);
  res.send({ blocked_list: blockedUsers });
});

const searchUsers = catchAsync(async (req, res) => {
  const users = await userService.searchUsers(req.params.param);
  res.send({ search_list: users });
});

const getVipLevel = catchAsync(async (req, res) => {
  const vipLevel = await userService.getVipLevel(req.params.id);
  res.send({ vip_level: vipLevel });
});

const getProExpiration = catchAsync(async (req, res) => {
  const expirationDate = await userService.getProExpiration(req.params.id);
  res.send({ expiration_date: expirationDate });
});

const getStoreSections = catchAsync(async (req, res) => {
  const storeData = await userService.getStoreSections(req.params.id);
  res.send(storeData);
});

const getUserLevel = catchAsync(async (req, res) => {
  const levelData = await userService.getUserLevel(req.params.id);
  res.send(levelData);
});

const getCreditsHistory = catchAsync(async (req, res) => {
  const creditsHistory = await userService.getCreditsHistory(req.params.id);
  res.send(creditsHistory);
});

const getCreditsAgency = catchAsync(async (req, res) => {
  const agencyData = await userService.getCreditsAgency(req.params.id);
  res.send(agencyData);
});

const getHostAgencyData = catchAsync(async (req, res) => {
  const hostAgencyData = await userService.getHostAgencyData(req.params.id);
  res.send(hostAgencyData);
});

const getJoinRequests = catchAsync(async (req, res) => {
  const joinRequests = await userService.getJoinRequests(req.params.id);
  res.send({ users: joinRequests });
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  addFriend,
  followUser,
  manageCredits,
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
