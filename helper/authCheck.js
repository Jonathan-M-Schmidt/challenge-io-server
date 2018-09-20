const jwt = require( 'jsonwebtoken' );

const authCheck = ( { token } ) => {
	if ( token ) {
		const tokenValue = token.replace( 'Bearer ', '' );
		const { userName } = jwt.verify( tokenValue, process.env.JWT_SECRET );
		return userName;
	}

	throw new Error( 'invalid token' );
};

module.exports = authCheck;
