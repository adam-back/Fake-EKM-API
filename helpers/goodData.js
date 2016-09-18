var extraFake = require( './extraFake' );
var cache     = require( '../cache' );
var moment    = require( 'moment' );
var faker     = require( 'faker' );

exports.beginsCharging = function() {
  return Math.random() < .3 ? true : false;
};

exports.createIdleReadingValues = function( key, version, plug ) {
  // get kWh from cache
  var idle = cache.cache[ key ][ version ][ plug.ekm_omnimeter_serial ];

  // create idle if it doesn't exist
  if ( !idle ) {
    idle = exports.createNewIdle( plug );
  }

  return {
    "Meter": plug.ekm_omnimeter_serial,
    "Group":564257,
    "Interval":60,
    "Protocol": version,
    "MAC_Addr": extraFake.generateFakeMacAddress(),
    "Tz_Offset_Sec":0,
    "Bad_Reads":0,
    "Good_Reads":1,
    "Credits":1000000,
    "ReadData": [{
      "Good":1,
      "Time_Stamp_UTC_ms": moment().valueOf(),
      "Firmware":"15",
      "Model":"2410",
      "kWh_Tot": idle.kwh,
      "RMS_Volts_Ln_1": faker.random.number( { min: 117, max: 125 } ).toString(),
      "RMS_Volts_Ln_2": faker.random.number( { min: 117, max: 125 } ).toString(),
      "Power_Factor_Ln_1": faker.random.number( { min: 80, max: 125 } ).toString(),
      "Power_Factor_Ln_2": faker.random.number( { min: 80, max: 125 } ).toString()
      }]
    };
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

exports.createNewIdle = function( plug ) {
  return {
    status: 'idle',
    error: null,
    until: null,
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
  cache.cache[ key ][ version ][ plug.ekm_omnimeter_serial ] = event;

  var fakeReading = {
    "Meter": plug.ekm_omnimeter_serial,
    "Group":564257,
    "Interval":60,
    "Protocol": version,
    "MAC_Addr": extraFake.generateFakeMacAddress(),
    "Tz_Offset_Sec":0,
    "Bad_Reads":0,
    "Good_Reads":1,
    "Credits":1000000,
    "ReadData": [{
      "Good":1,
      "Time_Stamp_UTC_ms": moment().valueOf(),
      "Firmware":"13",
      "Model":"1710",
      "kWh_Tot": event.kWh.toString(),
      "RMS_Volts_Ln_1": faker.random.number( { min: 117, max: 125 } ).toString(),
      "RMS_Volts_Ln_2": faker.random.number( { min: 117, max: 125 } ).toString(),
      "Amps_Ln_1": faker.random.number( { min: 10, max: 25 } ).toString(),
      "Amps_Ln_2": faker.random.number( { min: 10, max: 25 } ).toString(),
      "Power_Factor_Ln_1": faker.random.number( { min: 80, max: 125 } ).toString(),
      "Power_Factor_Ln_2": faker.random.number( { min: 80, max: 125 } ).toString()
      }]
    };

  return fakeReading;
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
