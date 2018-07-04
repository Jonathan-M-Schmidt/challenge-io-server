const mongoose = require( 'mongoose' );

module.exports = mongoose.model( 'User', {
	name: String,
	email: String,
	password: String,
	options: {
		allow_no_friend_rivals: { type: Boolean, default: true },
		push_notifications: { type: Boolean, default: true },
	},
	friends: [
		{
			id: String,
			date_friends_since: Date,
		},
	],
	rivals: [
		{
			id: String,
			challenge_id: String,
		},
	],
	challenges: [
		{
			challenge_id: String,
			total_score: Number,
		},
	],
	posts: Array,
	date_registered: Date,
} );
