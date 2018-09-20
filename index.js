const express = require( 'express' );
const mongoose = require( 'mongoose' );
const { ApolloServer } = require( 'apollo-server' );
const { registerServer } = require( 'apollo-server-express' );
const { graphiqlExpress } = require( 'apollo-server-express' );
const helmet = require( 'helmet' );
const compression = require( 'compression' );
const history = require( 'connect-history-api-fallback' );
const cors = require( 'cors' );

const typeDefs = require( './schema' );
const resolvers = require( './resolvers' );

require( 'dotenv' ).config();

const PORT = 3000;

const app = express();

mongoose.connect( process.env.DB_URL_LOCAL )
	.then( ( ) => {
		console.log( 'Connected to MongoDB' );
	} )
	.catch( ( err ) => {
		console.log( 'MongoDB Connection Error, restart Server' );
		console.log( err );
		process.exit( 1 );
	} );

const server = new ApolloServer( {
	cors: true,
	typeDefs,
	resolvers,
	context: ( { req } ) => {
		const token = req.headers.authorization || '';
		return { token };
	},
} );

app.use( cors() );
app.use( helmet() );
app.use( compression() );
app.use( history( {
	rewrites: [
		{ from: /\/graphiql/, to: '/graphiql' },
	],
} ) );

app.use(
	'/graphiql',
	graphiqlExpress( {
		endpointURL: '/graphql',
	} ),
);

registerServer( { server, app } );
app.use( express.static( './dist' ) );

app.get( '/', ( req, res ) => {
	res.sendFile( `${ __dirname }/dist/index.html` );
} );

app.listen( PORT, () => console.log( `server listening on port ${ PORT }` ) );

