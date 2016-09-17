exports.randomBroken = function() {
  return Math.random() < 0.1 ? true : false;
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

}


exports.createBadReading = function( meter ) {

};

exports.createOldReading = function( meter ) {

};

exports.createReadRingBufferFailure = function( meter ) {

};

exports.createIncorrectMeterReading = function( meter ) {

}

exports.createBrokenMeterValues = function( meter, type ) {
  switch ( type ) {
    case 'Bad Reading':
      return exports.createBadReading( meter );
    case 'Read Ring Buffer Failure':
      return exports.createReadRingBufferFailure( meter );
    case 'Old Reading':
      return exports.createOldReading( meter );
    default:
      return exports.createIncorrectMeterReading( meter );
  }
};

exports.createBrokenSet = function( plugs ) {
  var set = []

  for ( var numPlugs = plugs.length, i = 0; i < numPlugs; i++ ) {
    var plug = plugs[ i ];
    var type = exports.typeOfBroken();

    set.push( exports.createBrokenMeterValues( plug.ekm_omnimeter_serial, type ) );
  }

  return set;
};