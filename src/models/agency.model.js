// models/agency.model.js

const mongoose = require('mongoose');

const agencySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        dayTarget: { type: Number, default: 0 },
        monthTarget: { type: Number, default: 0 },
        credit: { type: Number, default: 0 },
        expectedSalary: { type: Number, default: 0 },
      },
    ],
    history: [
      {
        date: { type: Date, default: Date.now },
        amount: { type: Number, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Agency = mongoose.model('Agency', agencySchema);

module.exports = Agency;
