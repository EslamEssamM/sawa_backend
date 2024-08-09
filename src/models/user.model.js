const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
// const { roles } = require('../config/roles');
const { generateUniqueUserId } = require('../utils/IDGen');

// Define the User schema
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
    },
    userId: {
      type: String,
      unique: true,
      default: () => generateUniqueUserId(),
    },
    avatar: {
      type: String,
      default: '',
    },
    frame: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // pendingFriendRequests: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //   },
    // ],
    // sentFriendRequests: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //   },
    // ],
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],
    hostAgency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agency',
      default: null,
    },
    ignoredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    credits: {
      type: Number,
      default: 0,
    },
    famePoints: {
      type: Number,
      default: 0,
    },
    richPoints: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    isHost: {
      type: Boolean,
      default: false,
    },
    currentRoom: {
      type: String, // roomId
    },
  },
  {
    timestamps: true,
  }
);

// Add plugins that convert mongoose to JSON and add pagination
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

/**
 * Add a friend to the user's friends list
 * @param {ObjectId} friendId
 */
userSchema.methods.addFriend = async function (friendId) {
  if (!this.friends.includes(friendId)) {
    this.friends.push(friendId);
    await this.save();
  }
};

/**
 * Follow a user
 * @param {ObjectId} userId
 */
userSchema.methods.followUser = async function (userId) {
  if (!this.following.includes(userId)) {
    this.following.push(userId);
    await this.save();
  }
};

/**
 * Unfollow a user
 * @param {ObjectId} userId
 */
userSchema.methods.unfollowUser = async function (userId) {
  this.following = this.following.filter((id) => id.toString() !== userId.toString());
  await this.save();
};

/**
 * Block a user
 * @param {ObjectId} userId
 */
userSchema.methods.blockUser = async function (userId) {
  if (!this.blockedUsers.includes(userId)) {
    this.blockedUsers.push(userId);
    await this.save();
  }
};

/**
 * Unblock a user
 * @param {ObjectId} userId
 */
userSchema.methods.unblockUser = async function (userId) {
  this.blockedUsers = this.blockedUsers.filter((id) => id.toString() !== userId.toString());
  await this.save();
};

/**
 * Increment user credits
 * @param {number} amount
 */
userSchema.methods.addCredits = async function (amount) {
  this.credits += amount;
  await this.save();
};

/**
 * Decrement user credits
 * @param {number} amount
 */
userSchema.methods.deductCredits = async function (amount) {
  if (this.credits >= amount) {
    this.credits -= amount;
    await this.save();
  } else {
    throw new Error('Not enough credits');
  }
};

/**
 * Pre-save hook to hash password if modified
 */
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
