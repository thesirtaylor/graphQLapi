const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar DateTime
  type Query {
    getNote(id: ID): Note
    note: [Note]
    getUser: [User]
    user(username: String): User
    me: User!
    noteFeed(cursor: String): NoteFeed
  }

  type Mutation {
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String!, email: String, password: String!): String!
    newNote(content: String!): Note!
    removeNote(id: ID): String
    updateNote(id: ID, content: String, author: String): Note!
    toggleFavorite(id: ID!): Note
  }
  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String!
    notes: [Note!]!
    favorites: [Note!]!
    createdAt: DateTime
    updatedAt: DateTime
  }
  type Note {
    id: ID!
    content: String!
    author: User!
    favoriteCount: Int!
    favoritedBy: [User!]
    createdAt: DateTime
    updatedAt: DateTime
  }
  type NoteFeed{
    notes: [Note]!
    cursor: String!
    hasNextPage: Boolean!
  }
`;
