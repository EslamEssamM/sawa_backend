// models/levelSystem.model.js

const mongoose = require('mongoose');

const levelSystemSchema = mongoose.Schema(
  {
    level: {
      type: Number,
      required: true,
    },
    fameThreshold: {
      type: Number,
      required: true,
    },
    richThreshold: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LevelSystem = mongoose.model('LevelSystem', levelSystemSchema);

module.exports = LevelSystem;
