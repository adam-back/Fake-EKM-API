var broken = require( './brokenData' );
var cache  = require( '../cache' );
var good   = require( './goodData' );
var fate   = require( './fate' );
var moment = require( 'moment' );

var updateExisitingDataSet = function( plugs, version, key ) {
  var needClosing = cache.checkForEndedEvents( key );
  // create a skip list so those plugs don't get overwritten by system plugs
  for ( var numNeedClosing = needClosing.length, i = 0; i < numNeedClosing; i++ ) {
    var oneNeedClosing = needClosing[ i ];
    skipList[ oneNeedClosing.ekm_omnimeter_serial ] = true;
  }
  var closed = fate.decideMany( needClosing, {} );

  // add new plugs to the cache
  for ( var numPlugs = plugs.length, i = 0; i < numPlugs; i++ ) {
    var plugFromSystem = plugs[ i ];
    var plugFromCache = cache.cache[ key ][ version ][ plugFromCache.ekm_omnimeter_serial ];

    if ( !plugFromCache ) {
      plugFromCache = cache.addOneNewEntryToCache( plugFromSystem, version, key );
    }
  }

  var updates = fate.decideMany( plugs, skipList );
  var brokenReadings = broken.createBrokenSet( closed.broken.concat( updates.broken ) );
  var goodReadings = good.createGoodSet( closed.good.concat( updates.good, 'idle' ) );
  var chargeReadings = good.createGoodSet( closed.charging.concat( updates.charging, 'charging' ) );
  return [].concat( brokenReadings, goodReadings, chargeReadings );
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
  if ( cache[ cache ].hasOwnProperty( key ) === false || cache.cache[ key ].hasOwnProperty( version ) ) {
    // create everything from scratch
    cache.addNewEntriesToCache( plugs, version, key );
  }

  payload.readMeter.ReadSet = updateExisitingDataSet( plugs, version, key );
  return payload;
};

module.exports = generateFakeResponse;