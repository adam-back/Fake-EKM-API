var good = require( './goodData' );
var broken  = require( './brokenData' );

exports.decideFate = function( status ) {
  var fate;
  var charging = good.beginsCharging();
  var broke = broken.randomBroken();

  // if moving out of error
  if ( status === 'error' ) {
    // start a charge event
    if ( charging ) {
      fate = 'charging';
    // or begin idle
    } else {
      fate = 'idle';
    }
  // if moving out of charging
  } else if ( status === 'charging' ) {
    // due to broken
    if ( broke ) {
      fate = 'broken';
    // due to end event
    } else {
      fate = 'idle';
    }

  // previously idle
  } else {
    // now charging
    if ( charging ) {
      fate = 'charging';
    // now broken
    } else if ( broke ){
      fate = 'broken';
    // still idle
    } else {
      fate = 'idle';
    }
  }

  return fate;
};

exports.decideMany = function( plugs, skipList )  {
  var broke = [];
  // broke is a specific variable name so it doesn't conflict
  // with broken require statement at top.
  var charging = [];
  var idle = [];

  // see if any existing charge events or errors need to clear
  for ( var numPlugs = plugs.length, i = 0; i < numPlugs; i++ ) {
    var plug = plugs[ i ];

    if ( skipList[ plug.ekm_omnimeter_serial ] ) {
      continue;

    } else {
      var newFate = exports.decideFate( plug.status );
      if ( newFate === 'broken' ) {
        broke.push( plug );
      } else if ( newFate === 'charging' ) {
        charging.push( plug );
      } else {
        idle.push( plug );
      }
    }

  }

  return {
    broken: broke,
    charging: charging,
    idle: idle
  };
};