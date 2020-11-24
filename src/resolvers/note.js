module.exports = {
  author: async (note, _args, { models }) => {
    return await models.User.findOne({ _id: note.author });
  },
  favoritedBy: async (note, _args, { models }) => {
    return await models.User.find({ _id: { $in: note.favoritedBy } });
  }
};
