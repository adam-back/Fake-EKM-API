var meterVersion = function( meter ) {
  if( meter.match( /3[0]{1}[0-9]{7}|3[0]{2}[0-9]{6}|3[0]{3}[0-9]{5}|3[0]{4}[0-9]{4}|3[0]{5}[0-9]{3}|3[0]{6}[0-9]{2}|3[0]{7}[0-9]{1}|3[0]{8}/ ) ) {
    return 'v4';
  } else {
    return 'v3';
  }
};

var isTargetVersion = function( meter, targetVersion ) {
  return ( meterVersion( meter ) === targetVersion );
};

exports.filterOutWrongVersions = function( plugs, targetVersion ) {
  return plugs.filter(function( plug ) {
    return isTargetVersion( plug.ekm_omnimeter_serial, targetVersion );
  });
};