var moment = require( 'moment' );
var faker  = require( 'faker' );
/*
  We need a way to simulate medium- to long-term charge events and broken
  periods. As requests come in, the API key will act as a the key for this
  cache.
*/

exports.lastCalls = {
  // apiKey: moment
};

exports.cache = {
  /*
    apiKey: {
      v3: {
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
        }
      },
      v4: {
        '789': {
          status: 'idle',
          error: null,
          until: null,
          kwh: 50,
          meter: '789'
        }
      }
    }
  */
};

exports.checkForEndedEvents = function( version, key ) {
  // ended events can be:
  // 1. charging events
  // 2. errors
  var now = moment();
  var close = [];
  for ( var meter in exports.cache[ key ][ version ] ) {
    var reading = exports.cache[ key ][ version ][ meter ];
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
};

exports.addOneNewEntryToCache = function( plug, version, key ) {
  var data = exports.createIdleData( plug );
  exports.cache[ key ][ version ][ plug.ekm_omnimeter_serial ] = data;
  return data;
};

exports.addNewEntriesToCache = function( plugs, version, key, numFake ) {
  numFake = numFake || 10;

  // add new keys
  if ( !exports.cache.hasOwnProperty( key ) ) {
    exports.cache[ key ] = {};
  }

  // add new versions
  if ( !exports.cache[ key ].hasOwnProperty( version ) ) {
    exports.cache[ key ][ version ] = {};
  }

  // add plugs from actual system
  for ( var numPlugs = plugs.length, i = 0; i < numPlugs; i++ ) {
    var plug = plugs[ i ];
    exports.addOneNewEntryToCache( plug, version, key );
  }

  // add # plugs which aren't in system
  for ( var j = 0; j < numFake; j++ ) {
    var fakeMeter = faker.random.number( { min: 10000, max: 400000000 } );
    var fakeKwh = faker.random.number( { min: 0, max: 40000 } );
    fakeKwh += Math.random(); // add decimals
    fakeKwh = Number( fakeKwh.toFixed( 1 ) ); //round to tenths
    exports.addOneNewEntryToCache( { ekm_omnimeter_serial: fakeMeter, cumulative_kwh: fakeKwh }, version, key );
  }

  return exports.cache[ key ][ version ];
};