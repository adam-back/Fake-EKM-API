var caches = require( './cache' );
var moment = require( 'moment' );
var faker  = require( 'faker' );

exports.beginsCharging = function() {
  return Math.random() < .3 ? true : false;
};

exports.createIdleReadingValues = function( key, version, plug ) {
  // get kWh from cache
  // increment kWh
  // update cache
};

exports.createNewEvent = function( plug ) {
  return {
    status: 'charging',
    error: null,
    until: moment().add( faker.random.number( { min: 5, max: 30 } ), 'minutes' ),
    kwh: plug.cumulative_kwh,
    meter: plug.ekm_omnimeter_serial
  };
};

exports.createChargeEventValues = function( key, version, plug ) {
  // get charge event from cache
  var event = cache.cache[ key ][ version ][ plug.ekm_omnimeter_serial ];
  // create charge event if it doesn't exist
  if ( !event ) {
    event = exports.createNewEvent( plug );
  }
  // increment kWh
  event.kwh += 0.1;
  // update cache
};

exports.createGoodSet = function( key, version, plugs, type ) {
  var set = [];
  var cb;

  if ( type === 'charging' ) {
    cb = exports.createChargeEventValues;
  } else {
    cb = exports.createIdleReadingValues;
  }

  for ( var numPlugs = plugs.length, i = 0; i < numPlugs; i++ ) {
    var plug = plugs[ i ];
    set.push( cb( key, version, plug ) );
  }

  return set;
};
