// server.js
const express = require( 'express' );
const cors = require( 'cors' );
const fs = require('fs')
const app = express();

// Apply CORS middleware
app.use( cors() );

// Define routes
app.get( '/api/data', ( req, res ) => {
  fs.readFile( './data.json', 'utf-8', ( err, data ) => {
    if ( err ) {
      console.error( 'Error reading JSON file:', err );
      res.status( 500 ).json( { error: 'Failed to read JSON file' } );
      return;
    }
    try {
      const jsonData = JSON.parse( data );
      res.json( jsonData );
    } catch ( err ) {
      console.error( 'Error parsing JSON file:', err );
      res.status( 500 ).json( { error: 'Invalid JSON format' } );
    }
  } );
} );

// Start the server
const PORT = process.env.PORT || 3000;
app.listen( PORT, () => {
  console.log( `Server is running at http://localhost:${PORT}/api/data` );
} );


