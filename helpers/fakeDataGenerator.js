var broken = require( './brokenData' );
var cache  = require( '../cache' );
var good   = require( './goodData' );
var moment = require( 'moment' );

var updateExisitingDataSet = function( plugs, version, key ) {
  // see if any existing charge events or errors need to clear
  var needClosing = cache.checkForEndedEvents( key );
  // to close, readings can either move into charge event, idle, or new error



  for ( var numPlugs = plugs.length, i = 0; i < numPlugs; i++ ) {
    var plug = plugs[ i ];
    var plugFromCache = cache.cache[ key ][ plug.ekm_omnimeter_serial ];

    if ( plugFromCache ) {

    }
  }
};

exports.generateFakeResponse = function( plugs, version, key ) {
  // meters is an array of meter numbers as string
  // version is a string of v3 or v4
  var payload = {
    readMeter: {
      ReadSet: []
    }
  };

  // if key is not in the cache
  if ( cache.hasOwnProperty( key ) === false ) {
    // create everything from scratch
    cache.addNewEntriesToCache( plugs, version, key );
  }

  payload.readMeter.ReadSet = updateExisitingDataSet( plugs, version, key );
  return payload;
};

module.exports = generateFakeResponse;