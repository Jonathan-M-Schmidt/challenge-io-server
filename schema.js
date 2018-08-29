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

type AuthObject {
	user: User!
	token: String!
}

type Challenge {
	_id: String!
	name: String!
	adminID: String!
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
  login(email: String!, password: String!): AuthObject!
}

type Mutation {
  createCat(name: String!): Cat!
  signup(email: String!, name: String!, password: String!): String
  auth(jwt: String!): String
  userCreate(name: String!, email: String!, password: String!): AuthObject!
  createChallenge(
	  name: String!,
	  adminID: String!,
	  bannerImg: String,
	  dateFrom: String!,
	  dateTill: String!,
	  description: String!,
  ): Challenge!
}`;

module.exports = typeDefs;
