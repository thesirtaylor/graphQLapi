"use strict";
const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    favoriteCount: {
      type: Number,
      default: 0
    },
    favoritedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

const note = mongoose.model("note", noteSchema);
module.exports = note;
