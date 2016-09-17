var good = require( './goodData' );
var bad = require( './badData' );

exports.decideFate = function( status ) {
  var fate;
  var charging = good.beginsCharging();
  var broken = bad.randomBroken();

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
    if ( broken ) {
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
    } else if ( broken ){
      fate = 'broken';
    // still idle
    } else {
      fate = 'idle';
    }
  }

  return fate;
};