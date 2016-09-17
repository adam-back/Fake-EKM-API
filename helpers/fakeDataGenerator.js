var broken = require( './brokenData' );
var good = require( './goodData' );

exports.createNewDataSet = function( plugs, version, key ) {
  var broken = [];
  var good = [];

  // sort into broken and good
  for ( var numPlugs = plugs.length, i = 0; i < numPlugs; i++ ) {
    var plug = plugs[ i ];
    if ( broken.randomBroken() ) {
      broken.push( plug );
    } else {
      good.push( plug );
    }
  }

  return [].concat( broken.createBrokenSet, good.createGoodSet );
};

exports.generateFakeResponse = function( plugs, version, key ) {
  // meters is an array of meter numbers as string
  // version is a string of v3 or v4
  var payload = {};

  // if key is not in the cache
    // create everything from scratch
  // else the key is in the cache
    // update readings

  return payload;
};