const { gql } = require( 'apollo-server' );

const typeDefs = gql`type Cat {
  _id: String!
  name: String!
}

type Friend {
	id: String!
	date_friends_since: String!
}

type Rival {
	id: String!
	challenge_id: String!
}

type User {
  _id: String!
  name: String!
  email: String!
  password: String!
  rivals: [User]
  friends: [User]
  challenges: [String]
}

type Challenge {
	_id: String!
	name: String!
	bannerImg: String!
	dateFrom: String!
	dateTill: String!
	description: String!
	users: [String]
}

type Query {
  allUsers: [User!]!
  user(id: String!): User
  users(ids: [String]): [User]
  allChallenges: [Challenge!]!
  challenge(id: String!): Challenge
}

type Mutation {
  createCat(name: String!): Cat!
  signup(name: String!): String
  auth(jwt: String!): String
  createUser(name: String!, email: String!, password: String!): User!
}`;

module.exports = typeDefs;
