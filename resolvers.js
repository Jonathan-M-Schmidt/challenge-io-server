const User = require( './models/User' );
const Challenge = require( './models/Challenge' );
const mongoose = require( 'mongoose' );

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
		// TODO: use bcrypt to hash password
		async createUser( parent, args ) {
			const u = await new User( args ).save();
			u._id = u._id.toString();
			return u;
		},
		async signup( parent, { name } ) {
		// TODO: change method to work with users
			/* console.log('Name: ', name);
      const cat = await Cat.findOne({ name });

      if (!cat) {
        console.log('no Cat with that name found');
      }
 */
			return token.sign(
				{ name: cat.name },
				process.env.JWT_SECRET,
				{ expiresIn: '1h' },
			);
		},
		async auth( parent, { jwt } ) {
			let error;
			let decodedToken;
			token.verify( jwt, process.env.JWT_SECRET, ( err, decoded ) => {
				if ( err ) {
					error = err;
				}
				if ( decoded ) {
					decodedToken = decoded;
				}
			} );
			if ( decodedToken ) return decodedToken;
			return error;
		},
	},
};

module.exports = resolvers;
