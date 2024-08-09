// models/ignorance.model.js

const mongoose = require('mongoose');

const ignoranceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Ignorance = mongoose.model('Ignorance', ignoranceSchema);

module.exports = Ignorance;
