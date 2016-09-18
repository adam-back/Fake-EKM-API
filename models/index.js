var fs        = require( 'fs');
var path      = require( 'path' );
var Sequelize = require( 'sequelize' );
var basename  = path.basename( module.filename );
var db        = {};
var config    = require( '../config' );
var sequelize = new Sequelize( config.database, config.username, config.password, config );

//////////////////
// Import Schemas
//////////////////

// get all the files in the models/ directory
fs.readdirSync( __dirname )
  .filter( function( file ) {
    // filter out hidden files & this file
    return ( file.indexOf( '.' ) !== 0 ) && ( file !== basename );
  })
  // for each of the files
  .forEach( function( file ) {
    // import it
    var model = sequelize.import( path.join( __dirname, file ) );
    // set it to the db object
    db[ model.name ] = model;
  });

Object.keys( db ).forEach( function( modelName ) {
  // associate as needed
  if ( "associate" in db[ modelName ] ) {
    db[ modelName ].associate( db );
  }
});

sequelize.sync()
.then(function() {
  console.log( 'Success sync on startup' );
})
.catch(function( error ) {
  console.log( 'ERROR: sync on startup, ', error );
});

db.sequelize = sequelize;

module.exports = db;
