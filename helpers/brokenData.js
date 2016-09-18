var extraFake = require( './extraFake' );
var good      = require( './goodData' );
var cache     = require( '../cache' );
var moment    = require( 'moment' );
var faker     = require( 'faker' );

exports.randomBroken = function() {
  return Math.random() < 0.1 ? true : false;
};

exports.howManyMinutesBroken = function() {
  return faker.random.number( { min: 1, max: 10 } );
};

exports.typeOfBroken = function() {
  var rollTheDice = Math.random();

  // bad 40%
  // read ring buffer 30%
  // old 25%
  // incorrect 5%

  // bad meters are the most frequent
  if ( rollTheDice < .4 ) {
    return 'Bad Reading';
  } else if ( rollTheDice >= 0.4 && rollTheDice < 0.7 ) {
    return 'Read Ring Buffer Failure';
  } else if ( rollTheDice >= 0.7 && rollTheDice < 0.95 ) {
    return 'Old Reading';
  } else {
    return 'Incorrect Metering';
  }
  // incorrect metering is the most infrequent
};


exports.createBadReading = function( key, version, plug ) {
  return {
    "Meter": plug.ekm_omnimeter_serial,
    "Group":564257,
    "Interval":60,
    "Protocol": version,
    "MAC_Addr": extraFake.generateFakeMacAddress(),
    "Tz_Offset_Sec":0,
    "Bad_Reads":1,
    "Good_Reads":0,
    "Credits":1000000,
    "ReadData": [
      {
      "Good":0,
      "Time_Stamp_UTC_ms": moment().valueOf(),
      "PERR.NR":"26950"
      }
    ]
  };
};

exports.createOldReading = function( key, version, plug ) {
  var reading = good.createIdleReadingValues( key, version, plug );
  reading.ReadData[ 0 ].Time_Stamp_UTC_ms = moment().subtract( faker.random.number( { min: 1.1, max: 5 } ), 'hours' ).valueOf();
  return reading;
};

exports.createReadRingBufferFailure = function( key, version, plug ) {
  return {
    "Meter": plug.ekm_omnimeter_serial,
    "MAC_Addr": extraFake.generateFakeMacAddress(),
    "Credits":1000000
  };
};

exports.createIncorrectMeterReading = function( key, version, plug ) {
  var reading = good.createIdleReadingValues( key, version, plug );
  delete reading.ReadData[ 0 ].kWh_Tot;
  return reading;
};

exports.createBrokenMeterValues = function( key, version, plug, type ) {
  switch ( type ) {
    case 'Bad Reading':
      return exports.createBadReading( key, version, plug );
    case 'Read Ring Buffer Failure':
      return exports.createReadRingBufferFailure( key, version, plug );
    case 'Old Reading':
      return exports.createOldReading( key, version, plug );
    default:
      return exports.createIncorrectMeterReading( key, version, plug );
  }
};

exports.createBrokenSet = function( key, version, plugs ) {
  var set = [];

  for ( var numPlugs = plugs.length, i = 0; i < numPlugs; i++ ) {
    var plug = plugs[ i ];
    var type = exports.typeOfBroken();
    var broke = exports.createBrokenMeterValues( key, version, plug, type );
    // update cache
    cache.cache[ key ][ version ][ plug.ekm_omnimeter_serial ] = {
      status: 'error',
      error: type,
      until: moment().add( exports.howManyMinutesBroken(), 'minutes' ),
      kwh: plug.ekm_omnimeter_serial,
      meter: plug.ekm_omnimeter_serial
    };
    // push reading
    set.push( broke );
  }

  return set;
};