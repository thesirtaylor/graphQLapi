const models = require("../models/index");

module.exports = {
  note: async (parent, args, { models }) => {
    return await models.Note.find();
  },
  getNote: async (parent, args, { models }) => {
    let oneNote = await models.Note.findOne({
      _id: args.id
    });
    return oneNote;
  },
  getUser: async (parent, args, { models }) => {
    return await models.User.find();
  },
  user: async (parent, { username }, { models }) => {
    return await models.User.findOne({
      username: username
    });
  },
  me: async (parent, args, { models, user }) => {
    try {
      let me = await models.User.findOne({ _id: user.id });
      return me;
    } catch (error) {
      throw new Error(error);
    }
  },
  noteFeed: async (parent, { cursor }, { models }) => {
    const limit = 4;
    let hasNextPage = false;
    let cursorQuery = {};
    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }
    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);
      if (notes.length > limit) {
          hasNextPage = true;
          notes = notes.slice(0, -1);
      }
      const newCursor = notes[notes.length - 1]._id;
      return {
        notes, 
        cursor: newCursor,
        hasNextPage
      }
  }
};
