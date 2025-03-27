const fs = require( 'fs' );


const getData = () => {
// Read the JSON file
  fs.readFile( './data.json', 'utf8', ( err, data ) => {
    if ( err ) {
      console.error( 'Error reading file:', err );
      return;
    }

    // Parse the JSON data
    let jsonData = JSON.parse( data );
    console.log(jsonData[0])
    return jsonData
  })
}

const modData = ( k, v ) => {
  let jsonData = getData()
  // Modify the JSON data
  jsonData[k] = v;

  // Convert the JSON object back to a string
  const updatedData = JSON.stringify( jsonData, null, 2 );

  // Write the updated JSON back to the file
  fs.writeFile( 'data.json', updatedData, 'utf8', ( err ) => {
    if ( err ) {
      console.error( 'Error writing file:', err );
      return;
    }
    console.log( 'File successfully updated!' );
  } );
}

module.exports = {getData, modData}
