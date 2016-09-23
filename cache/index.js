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
          cumulative_kwh: 12,
          ekm_omnimeter_serial: '123'
        },
        '456': {
          status: 'error',
          error: 'Old Read',
          until: moment object,
          cumulative_kwh: 15,
          ekm_omnimeter_serial: '456'
        }
      },
      v4: {
        '789': {
          status: 'idle',
          error: null,
          until: null,
          cumulative_kwh: 50,
          ekm_omnimeter_serial: '789'
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
    var cachedEvent = exports.cache[ key ][ version ][ meter ];
    if ( moment.isMoment( cachedEvent.until ) && cachedEvent.until.isAfter( now ) ) {
      close.push( cachedEvent );
    }
  }

  return close;
};

exports.createIdleData = function( kwh, meter ) {
  return {
    status: 'idle',
    error: null,
    until: null,
    cumulative_kwh: kwh,
    ekm_omnimeter_serial: meter
  };
};

exports.addOneNewEntryToCache = function( kwh, meter, version, key ) {
  var data = exports.createIdleData( kwh, meter );
  exports.cache[ key ][ version ][ meter ] = data;
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
    exports.addOneNewEntryToCache( plug.cumulative_kwh, plug.ekm_omnimeter_serial, version, key );
  }

  // add # plugs which aren't in system
  for ( var j = 0; j < numFake; j++ ) {
    var fakeMeter = faker.random.number( { min: 10000, max: 400000000 } );
    var fakeKwh = faker.random.number( { min: 0, max: 40000 } );
    fakeKwh += Math.random(); // add decimals
    fakeKwh = fakeKwh.toFixed( 1 ); //round to tenths
    exports.addOneNewEntryToCache( fakeMeter, fakeKwh, version, key );
  }

  return exports.cache[ key ][ version ];
};