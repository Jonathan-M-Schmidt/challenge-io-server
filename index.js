const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const jwt = require( 'express-jwt' );
const cors = require( 'cors' );
const mongoose = require( 'mongoose' );
const { ApolloServer } = require( 'apollo-server' );
const { registerServer } = require( 'apollo-server-express' );

const typeDefs = require( './schema' );
const resolvers = require( './resolvers' );

require( 'dotenv' ).config();

const PORT = 3000;

const app = express();

mongoose.connect( process.env.DB_URL_LOCAL );

const server = new ApolloServer( {
	typeDefs,
	resolvers,
} );

app.listen( PORT, () => console.log( `server listening on port ${ PORT }` ) );

registerServer( { server, app } );

// app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
