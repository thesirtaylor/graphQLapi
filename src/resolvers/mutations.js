require("dotenv").config();
const models = require("../models/index");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AuthenticationError, ForbiddenError } = require("apollo-server-express");
const gravatar = require("../util/gravatar");

module.exports = {
  signUp: async (parent, { username, email, password }, { models }) => {
    email = email.trim().toLowerCase();
    const hashed = await bcrypt.hash(password, 10);
    const avatar = gravatar(email);
    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed
      });
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error(`Error creating User`);
    }
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) {
      email = email.trim().toLowerCase();
    }
    let user = await models.User.findOne({ $or: [{ username: username }, { email: email }] });
    if (user) {
      let compare = await bcrypt.compare(password, user.password);
      if (!compare) {
        return `incorrect Password`;
      }
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    }
    return `Account don't exist with us`;
  },
  newNote: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError("Must be signed in");
    }
    let nu = await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id)
    });
    if (nu) {
      return nu;
    }
    return `no nu`;
  },
  removeNote: async (parent, { id }, { models, user }) => {
    try {
      if (!user) {
        throw new AuthenticationError("Must be signed in");
      }
      const note = await models.Note.findById(id);
      if (note && String(note.author) !== user.id) {
        throw new ForbiddenError("You have no permission for this");
      }
      await note.remove();
      return true;
    } catch (error) {
      return false;
    }
  },
  updateNote: async (parent, { content, id }, { models, user }) => {
    try {
      if (!user) {
        throw new AuthenticationError("Must be signed in");
      }
      const note = await models.Note.findById(id);
      if (note && String(note.author) !== user.id) {
        throw new ForbiddenError("No permission set");
      }
      const update = await models.Note.updateOne(
        {
          _id: id
        },
        {
          $set: {
            content
          }
        }
      );
      if (update.ok === 1) {
        return note;
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  },
  toggleFavorite: async (parent, { id }, { models, user }) => {
    try {
      if (!user) {
        throw new AuthenticationError();
      }
      const noteCheck = await models.Note.findById(id);
      const hasUser = noteCheck.favoritedBy.indexOf(user.id);
      if (hasUser >= 0) {
        const nowt = await models.Note.updateOne(
          {
            _id: id
          },
          {
            $pull: {
              favoritedBy: mongoose.Types.ObjectId(user.id)
            },
            $inc: {
              favoriteCount: -1
            }
          },
          {
            new: true
          }
        );
        // console.log(nowt);
        return noteCheck;
      }
      const nunowt = await models.Note.updateOne(
        { _id: id },
        {
          $push: { favoritedBy: mongoose.Types.ObjectId(user.id) },
          $inc: { favoriteCount: 1 }
        },
        { new: true }
      );
      // console.log(nunowt);
      return noteCheck;
    } catch (error) {
      throw new Error(error);
    }
  }
};
