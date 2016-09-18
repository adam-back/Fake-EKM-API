var generateFakeData = require( '../helpers/fakeDataGenerator' );
var models   = require( '../models' );

module.exports = exports = {
  getRealTimeData: function ( req, res, next ) {
    models.plug.findAll( { where: { ekm_omnimeter_serial: { $ne: null } }, raw: true } )
    .then(function( plugs ) {
      var response = generateFakeData( plugs, req.params.version, req.params.key );
      res.json( response );
    })
    .catch(function( error ) {
      next( error );
    });
  }
};
