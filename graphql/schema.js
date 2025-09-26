const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type User {
    id: ID!
    username: String!
    email: String!
    todos: [Todo!]!
  }

  type Todo {
    id: ID!
    text: String!
    completed: Boolean!
    creator: User!
  }

  type AuthData {
    token: String!
    userId: ID!
  }

  type Query {
    todos: [Todo!]!
    todo(id: ID!): Todo
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): AuthData!
    createTodo(text: String!): Todo!
    updateTodo(id: ID!, text: String, completed: Boolean): Todo
    deleteTodo(id: ID!): Boolean
  }
`);

module.exports = schema;