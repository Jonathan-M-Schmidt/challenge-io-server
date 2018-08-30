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

type UserOptions {
	allow_no_friend_rivals: Boolean!
	push_notifications: Boolean!
}

type User {
  _id: String!
  options: UserOptions!
  name: String!
  email: String!
  password: String!
  rivals: [User]
  friends: [User]
  challenges: [String]
  challengeInvites: [String!]
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
  auth(token: String!): Boolean!
  challengesAsAdmin(id: String!): [Challenge]
}

type Mutation {
  userCreate(name: String!, email: String!, password: String!): AuthObject!
  createChallenge(
	  name: String!,
	  adminID: String!,
	  bannerImg: String,
	  dateFrom: String!,
	  dateTill: String!,
	  description: String!,
  ): Challenge!
  deleteChallenge(id: String!): Boolean!
  inviteUsersToChallenge(users: [String!], challengeID: String!): Boolean
}`;

module.exports = typeDefs;
