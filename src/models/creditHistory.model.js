// models/creditsHistory.model.js

const mongoose = require('mongoose');

const creditsHistorySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['add', 'deduct', 'purchase'],
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const CreditsHistory = mongoose.model('CreditsHistory', creditsHistorySchema);

module.exports = CreditsHistory;
