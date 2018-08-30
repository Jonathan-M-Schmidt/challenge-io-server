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
		async auth( parent, { token } ) {
			let result = false;
			jwt.verify( token, process.env.JWT_SECRET, ( err, decoded ) => {
				if ( decoded ) {
					result = true;
				}
			} );
			return result;
		},
		async login( parent, { email, password } ) {
			const user = await User.findOne( { email } );
			if ( !user ) {
				throw new Error( 'No User with this Email.' );
			}
			const valid = await bcrypt.compare( password, user.password );
			if ( !valid ) {
				throw new Error( 'Wrong password.' );
			}
			const token = jwt.sign( {
				userName: user.name,
			}, process.env.JWT_SECRET );
			return {
				user,
				token,
			};
		},
		async challengesAsAdmin( parent, { id } ) {
			const challenges = await Challenge.find( { adminID: id } );
			if ( !challenges ) return [];
			return challenges;
		},
	},
	User: {
		async friends( user ) {
			const objIds = [];
			user.friends.forEach( ( id ) => {
				objIds.push( mongoose.Types.ObjectId( id.id ) );
			} );
			const friends = await User.find( { _id: { $in: objIds } } );
			return friends;
		},
		async rivals( user ) {
			const objIds = [];
			user.rivals.forEach( ( id ) => {
				objIds.push( mongoose.Types.ObjectId( id.id ) );
			} );
			const rivals = await User.find( { _id: { $in: objIds } } );
			return rivals;
		},
	},
	Mutation: {
		async userCreate( parent, { email, name, password } ) {
			const userExists = await User.findOne( { email } );
			if ( userExists ) {
				throw new Error( 'This Email is allready registered.' );
			}
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
		async createChallenge( parent, {
			name,
			adminID,
			bannerImg,
			dateFrom,
			dateTill,
			description,
		} ) {
			const nameTaken = await Challenge.findOne( { name } );
			if ( nameTaken ) {
				throw new Error( 'This name is allready taken.' );
			}
			const imgURL = bannerImg ||
				'https://wikitravel.org/upload/shared/6/6a/Default_Banner.jpg';
			const challenge = await Challenge.create( {
				name,
				adminID,
				bannerImg: imgURL,
				dateFrom,
				dateTill,
				description,
			} );
			return challenge;
		},
		async deleteChallenge( parent, { id } ) {
			if ( id === '' ) {
				throw new Error( 'No ID was given' );
			}
			const challenge = await Challenge.deleteOne( { _id: id }, ( err ) => {
				if ( err ) {
					console.log( err );
				}
			} );
			return !!challenge;
		},
		async inviteUsersToChallenge( parent, { users, challengeID } ) {
			return users.forEach( ( user ) => {
				User.findById( user, ( err, doc ) => {
					if ( err ) {
						console.log( 'user not found' );
						throw new Error( 'At least one user was not found.' );
					}
					if ( doc ) {
						try {
							let index = -1;
							if ( doc.challengeInvites ) {
								index = doc.challengeInvites.findIndex( id => id === challengeID );
							}
							if ( index === -1 ) {
								doc.challengeInvites.push( challengeID );
								doc.save();
							} else {
								console.log( 'already invited' );
								throw new Error( 'User already invited' );
							}
						} catch ( error ) {
							console.log( error );
						}
					}
				} );
			} );
		},
	},
};

module.exports = resolvers;
