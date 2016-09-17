var moment = require( 'moment' );
var faker  = require( 'faker' );
/*
  We need a way to simulate medium- to long-term charge events and broken
  periods. As requests come in, the API key will act as a the key for this
  cache.
*/

exports.cache = {
  /*
    apiKey: {
      '123': {
        status: 'charging',
        error: null,
        until: moment object,
        kwh: 12,
        meter: '123'
      },
      '456': {
        status: 'error',
        error: 'Old Read',
        until: moment object,
        kwh: 15,
        meter: '456'
      },
      '789': {
        status: 'idle',
        error: null,
        until: null,
        kwh: 50,
        meter: '789'
      }
    }
  */
};

exports.checkForEndedEvents = function( key ) {
  // ended events can be:
  // 1. charging events
  // 2. errors
  var now = moment();
  var close = [];
  for ( var meter in exports.cache[ key ] ) {
    var reading = exports.cache[ key ][ meter ];
    if ( moment.isMoment( reading.until ) && reading.until.isAfter( now ) ) {
      close.push( reading );
    }
  }

  return close;
};

exports.createIdleData = function( plug ) {
  return {
    status: 'idle',
    error: null,
    until: null,
    kWh: plug.cumulative_kwh,
    meter: plug.ekm_omnimeter_serial
  };
}

exports.addNewEntriesToCache = function( key, plugs ) {
  exports.cache[ key ] = {};

  // add plugs from actual system
  for ( var numPlugs = plugs.length, i = 0; i < numPlugs; i++ ) {
    var plug = plugs[ i ];
    exports.cache[ key ][ plug.ekm_omnimeter_serial ] = exports.createIdleData( plug );
  }

  // add plugs which aren't in system
  for ( var j = 0; j < 7; j++ ) {
    var fakeMeter = faker.random.number( { min: 10000, max: 400000000 } );
    var fakeKwh = faker.random.number( { min: 0, max: 40000 } );
    fakeKwh += Math.random(); // add decimals
    fakeKwh = Number( fakeKwh.toFixed( 1 ) ); //round to tenths
    exports.cache[ key ][ fakeMeter ] = exports.createIdleData( { ekm_omnimeter_serial: fakeMeter, cumulative_kwh: fakeKwh } );
  }

  return exports.cache[ key ];
};