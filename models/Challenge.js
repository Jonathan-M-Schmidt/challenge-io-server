const mongoose = require( 'mongoose' );

module.exports = mongoose.model( 'Challenge', {
	name: String,
	bannerImg: String,
	dateFrom: Date,
	dateTill: Date,
	description: String,
	users: Array,
} );
