const Query = require("../resolvers/query");
const Mutation = require("../resolvers/mutations");
const User = require("../resolvers/user");
const Note = require("../resolvers/note");
const {GraphQLDateTime} = require("graphql-iso-date");

module.exports = {
  Query,
  Mutation,
  Note,
  User,
  DateTime: GraphQLDateTime
}