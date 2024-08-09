// models/store.model.js

const mongoose = require('mongoose');

const storeSchema = mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
