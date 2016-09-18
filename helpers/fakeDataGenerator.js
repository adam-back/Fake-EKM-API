var meterVersioning = require( './meterVersioning' );
var broken          = require( './brokenData' );
var cache           = require( '../cache' );
var good            = require( './goodData' );
var fate            = require( './fate' );
var moment          = require( 'moment' );

var updateExisitingDataSet = function( plugs, version, key ) {
  var needClosing = cache.checkForEndedEvents( version, key );
  var skipList = {};

  // create a skip list so those plugs don't get overwritten by system plugs
  for ( var numNeedClosing = needClosing.length, i = 0; i < numNeedClosing; i++ ) {
    var oneNeedClosing = needClosing[ i ];
    skipList[ oneNeedClosing.ekm_omnimeter_serial ] = true;
  }
  var closed = fate.decideMany( needClosing, {} );

  // add new plugs to the cache
  for ( var numPlugs = plugs.length, j = 0; j < numPlugs; j++ ) {
    var plugFromSystem = plugs[ j ];
    var plugFromCache = cache.cache[ key ][ version ][ plugFromSystem.ekm_omnimeter_serial ];

    if ( !plugFromCache ) {
      plugFromCache = cache.addOneNewEntryToCache( plugFromSystem, version, key );
    }
  }

  var updates = fate.decideMany( plugs, skipList );
  var brokenReadings = broken.createBrokenSet( key, version, closed.broken.concat( updates.broken ) );
  var goodReadings = good.createGoodSet( key, version, closed.idle.concat( updates.idle ), 'idle' );
  var chargeReadings = good.createGoodSet( key, version, closed.charging.concat( updates.charging ), 'charging' );

  return [].concat( brokenReadings, goodReadings, chargeReadings );
};

var generateFakeResponse = function( plugs, version, key ) {
  // meters is an array of meter numbers as string
  // version is a string of v3 or v4
  cache.lastCalls[ key ] = moment();
  var payload = {
    readMeter: {
      Requested: 0,
      ReadSet: []
    }
  };
  var targetPlugs = meterVersioning.filterOutWrongVersions( plugs, version );

  // if key is not in the cache
  if ( cache.cache.hasOwnProperty( key ) === false || cache.cache[ key ].hasOwnProperty( version ) ) {
    // create everything from scratch
    cache.addNewEntriesToCache( targetPlugs, version, key );
  }

  payload.readMeter.ReadSet = updateExisitingDataSet( targetPlugs, version, key );
  payload.readMeter.Requested = payload.readMeter.ReadSet.length;
  return payload;
};

module.exports = generateFakeResponse;