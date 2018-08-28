const User = require( './models/User' );
const Challenge = require( './models/Challenge' );
const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );

const resolvers = {
	Query: {
		async allUsers() {
			const users = await User.find();
			return users;
		},
		async user( parent, { id } ) {
			if ( id === '' ) {
				console.log( ' no id' );
				throw new Error( 'No ID was given' );
			}
			const objId = mongoose.Types.ObjectId( id );
			const user = await User.findOne( objId );
			return user;
		},
		async users( parent, { ids } ) {
			const objIds = [];
			ids.forEach( ( id ) => {
				objIds.push( mongoose.Types.ObjectId( id ) );
			} );
			const users = await User.find( { _id: { $in: objIds } } );
			return users;
		},
		async allChallenges() {
			const challenges = await Challenge.find();
			return challenges;
		},
		async challenge( parent, { id } ) {
			const objId = mongoose.Types.ObjectId( id );
			const challenge = await Challenge.findOne( objId );
			return challenge;
		},
	},
	User: {
		async friends( user ) {
			console.log( 'User: ', user );
			const objIds = [];
			user.friends.forEach( ( id ) => {
				objIds.push( mongoose.Types.ObjectId( id.id ) );
			} );
			const friends = await User.find( { _id: { $in: objIds } } );
			console.log( 'Friends: ', friends );
			return friends;
		},
		async rivals( user ) {
			console.log( 'User: ', user );
			const objIds = [];
			user.rivals.forEach( ( id ) => {
				objIds.push( mongoose.Types.ObjectId( id.id ) );
			} );
			const rivals = await User.find( { _id: { $in: objIds } } );
			console.log( 'rivals: ', rivals );
			return rivals;
		},
	},
	Mutation: {
		async userCreate( parent, { email, name, password } ) {
			// TODO: Check if email allready exists
			// return new token
			const hash = await bcrypt.hash( password, 10 );
			const user = await User.create( {
				name,
				email,
				password: hash,
			} );
			const token = jwt.sign( {
				userName: user.name,
			}, process.env.JWT_SECRET );

			return {
				user,
				token,
			};
		},
		// async userLogin( parent, { email, password } ) {
		// 	// TODO:
		// 	// check if user exists
		// 	// compare password with bcrypt
		// 	// return new token
		// },
	},
};

module.exports = resolvers;
