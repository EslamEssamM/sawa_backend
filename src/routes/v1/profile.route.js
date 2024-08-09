// routes/profile.routes.js

const express = require('express');
const profileController = require('../../controllers/profile.controller');

const router = express.Router();

// Main profile routes
router.get('/me', profileController.getMainProfile); // Get the current user's main profile
router.put('/me', profileController.updateMainProfile); // Update the current user's main profile

// Public profile routes
router.get('/:userId', profileController.getPublicProfile); // Get another user's public profile

// Friends and social routes
router.get('/:id/friends', profileController.getFriendsList); // Get the user's friends list
router.get('/:id/followers', profileController.getFollowersList); // Get the user's followers list
router.get('/:id/following', profileController.getFollowingList); // Get the user's following list
router.get('/:id/blocked', profileController.getBlockedList); // Get the user's blocked list

// VIP level and subscription routes
router.get('/:id/vipLevel', profileController.getVipLevel); // Get VIP level of a user
router.get('/:id/proExpiration', profileController.getProExpiration); // Get Pro expiration date

// Store and inventory routes
router.get('/:id/storeSections', profileController.getStoreSections); // Get store sections for the user
router.get('/:id/level', profileController.getUserLevel); // Get user level data
router.get('/:id/creditsHistory', profileController.getCreditsHistory); // Get credits history
router.get('/:id/creditsAgency', profileController.getCreditsAgency); // Get credits agency data
router.get('/:id/hostAgencyData', profileController.getHostAgencyData); // Get host agency data

// Social interaction routes
router.post('/:userId/follow', profileController.followUser); // Follow a user
router.post('/:userId/unfollow', profileController.unfollowUser); // Unfollow a user
router.post('/:userId/block', profileController.blockUser); // Block a user
router.post('/:userId/unblock', profileController.unblockUser); // Unblock a user

// Join requests and agency management
router.get('/:id/joinRequests', profileController.getJoinRequests); // Get join requests

// Search users
router.get('/search/:param', profileController.searchUsers); // Search users by a parameter

module.exports = router;
