var generateFakeData = require( '../helpers/fakeDataGenerator' );
var models   = require( '../models' );

module.exports = exports = {
  getRealTimeData: function ( req, res, next ) {
    var version = req.params.version;
    if ( version !== 'v3' && version !== 'v4' ) {
      next( 'Incorrect version. Only v3 and v4 accepted.' );
    }
    models.plug.findAll( { where: { ekm_omnimeter_serial: { $ne: null } }, raw: true } )
    .then(function( plugs ) {
      var response = generateFakeData( plugs, version, req.params.key );
      res.json( response );
    })
    .catch(function( error ) {
      next( error );
    });
  }
};
