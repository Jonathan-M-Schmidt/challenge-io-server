const express = require( 'express' );
const mongoose = require( 'mongoose' );
const { ApolloServer } = require( 'apollo-server' );
const { registerServer } = require( 'apollo-server-express' );
const { graphiqlExpress } = require( 'apollo-server-express' );
const history = require( 'connect-history-api-fallback' );

const typeDefs = require( './schema' );
const resolvers = require( './resolvers' );

require( 'dotenv' ).config();

const PORT = 3000;

const app = express();

mongoose.connect( process.env.DB_URL_LOCAL );

const server = new ApolloServer( {
	typeDefs,
	resolvers,
	context: ( { req } ) => {
		const token = req.headers.authorization || '';
		return { token };
	},
} );
app.use( history() );
app.use(
	'/graphiql',
	graphiqlExpress( {
		endpointURL: '/graphql',
	} ),
);

app.listen( PORT, () => console.log( `server listening on port ${ PORT }` ) );

registerServer( { server, app } );

app.use( express.static( './public' ) );

app.get( '/', ( req, res ) => {
	res.sendFile( `${ __dirname }/public/index.html` );
} );
