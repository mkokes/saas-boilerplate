const { gql } = require('apollo-server-koa');

module.exports = gql`
  type Query {
    hello(name: String!): String
  }
`;
