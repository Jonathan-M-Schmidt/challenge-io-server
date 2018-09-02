const jwt = require( 'jsonwebtoken' );

function getUserId( { token } ) {
	if ( token ) {
		const tokenValue = token.replace( 'Bearer ', '' );
		const { userName } = jwt.verify( tokenValue, process.env.JWT_SECRET );
		return userName;
	}

	throw new Error( 'Not authenticated' );
}

module.exports = getUserId;
