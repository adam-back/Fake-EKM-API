var generateFakeData = require( '../helpers/fakeDataGenerator' );
var meterVersioning  = require( '../helpers/meterVersioning' );
var models   = require( '../models' );

module.exports = exports = {
  getRealTimeData: function ( req, res, next ) {
    if( !meterVersioning.isAvailableVersion( req.params.version ) ) {
      next( 'Incorrect version. Only v3 and v4 accepted.' );
    }
    models.plug.findAll( { where: { ekm_omnimeter_serial: { $ne: null } }, raw: true } )
    .then(function( plugs ) {
      var response = generateFakeData( plugs, req.params.version, req.params.key );
      res.json( response );
    })
    .catch(function( error ) {
      next( error );
    });
  },
  getDataForSomeMeters: function( req, res, next ) {
    if( !meterVersioning.isAvailableVersion( req.params.version ) ) {
      next( 'Incorrect version. Only v3 and v4 accepted.' );
    }

    var meters = req.params.meters.split( ',' );

    models.plug.findAll( { where: { ekm_omnimeter_serial: { $in: meters } }, raw: true } )
    .then(function( plugs ) {
      var response = generateFakeData( plugs, req.params.version, req.params.key );
      res.json( response );
    })
    .catch(function( error ) {
      next( error );
    });
  }
};
