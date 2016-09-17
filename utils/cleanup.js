var cache  = require( '../cache' );
var moment = require( 'moment' );

exports.scrubCacheOfOldData = function() {
  var thirtyMinutesAgo = moment().subtract( 30, 'minutes' );

  var newCache = {};
  for ( var apiKey in cache.lastCalls ) {
    var lastCalls = cache.lastCalls[ apiKey ];
    // if recent
    if ( lastCalls.isAfter( thirtyMinutesAgo ) ) {
      // add to new cache
      newCache[ apiKey ] = cache.cache[ apiKey ];
    }
    // otherwise it's old and we don't want to keep it
  }

  // completely replace old cache
  cache.cache = newCache;
  return newCache;
};

exports.cleanCacheOnInterval = function() {
  var tenMinutes = 1000 * 60 * 10;
  return setInterval( exports.scrubCacheOfOldData, tenMinutes );
};