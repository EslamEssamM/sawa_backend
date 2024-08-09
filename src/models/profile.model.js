const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Define the Profile schema
const ProfileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    country: {
      type: String,
      default: '',
    },
    chargeLevel: {
      level: { type: Number, default: 1 },
      stars: { type: Number, default: 0.0, min: 0, max: 11 },
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    age: {
      type: Number,
    },
    charisma: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    groupName: {
      type: String,
      default: '',
    },
    info: {
      about: { type: String, default: '' },
      album: [{ type: String }], // Array of image URLs or paths
      interests: [{ type: String }],
    },
    gifts: {
      totalGifts: { type: Number, default: 0 },
      topGifts: [
        {
          image: String, // Image URL or path
        },
      ],
    },
    badges: {
      totalBadges: { type: Number, default: 0 },
      topBadges: [
        {
          image: String, // Image URL or path
        },
      ],
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
ProfileSchema.plugin(toJSON);
ProfileSchema.plugin(paginate);

/**
 * @typedef Profile
 */
const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
