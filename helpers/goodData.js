exports.beginsCharging = function() {
  return Math.random() < .3 ? true : false;
};

exports.createIdleReadingValues = function( plug ) {};

exports.createChargeEventValues = function( plug ) {};

exports.createGoodSet = function( plugs ) {
  var set = []
  return set;
};