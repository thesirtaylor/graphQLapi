// index.js
// This is the main entry point of our application
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 4000;
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("../src/schema");
const resolvers = require("../src/resolvers/index");
const models = require("../src/models/index");
const getUser = require("../src/util/userToken");
const helmet = require("helmet");
const cors = require("cors");
const depthLimit = require("graphql-depth-limit");
const {createComplexityLimitRule} = require("graphql-validation-complexity")

app.use(helmet());
app.use(cors());
mongoose
  .connect(
    process.env.DB_HOST,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    app.listen({ port }, () =>
      console.log(`GraphQL http://localhost:${port}${server.graphqlPath}`)
    );
  })
  .catch(error => console.log(error));
mongoose.connection.on("error", error => {
  console.error(error);
  console.log(`Mongo connection error.
      Please make sure MongoDB is running.`);
  process.exit();
});

app.get("/", (req, res) => res.send(`Hello World`));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = getUser.getUser(token);
    // console.log(user);
    return { models, user };
  },
});
server.applyMiddleware({ app, path: `/api` });
