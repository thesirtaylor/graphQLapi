"use strict";

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    email: {
      type: String,
      required: true,
      index: {
        index: true
      }
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    },
  },
  {
    timestamps: true
  }
);

const user = mongoose.model("user", UserSchema);
module.exports = user;
