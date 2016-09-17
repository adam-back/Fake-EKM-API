exports.beginsCharging = function() {
  return Math.random() < .3 ? true : false;
};

exports.createIdleReadingValues = function( plug ) {
  // get kWh from cache
  // increment kWh
  // update cache
};

exports.createChargeEventValues = function( plug ) {
  // get charge event from cache
  // create charge event if it doesn't exist
  // increment kWh
  // update cache
};

exports.createGoodSet = function( plugs, type ) {
  var set = [];
  var cb;

  if ( type === 'charging' ) {
    cb = exports.createChargeEventValues;
  } else {
    cb = exports.createIdleReadingValues;
  }

  for ( var numPlugs = plugs.length, i = 0; i < numPlugs; i++ ) {
    var plug = plugs[ i ];
    set.push( cb( plug ) );
  }

  return set;
};
