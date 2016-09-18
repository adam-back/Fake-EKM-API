var faker = require( 'faker' );

exports.generateFakeMacAddress = function() {
  var fakeMAC = '40:16:fa:01:';
  fakeMAC += faker.random.number( { min: 0, max: 9} ).toString() + faker.random.number( { min: 0, max: 9} ).toString();
  fakeMAC += ':' + faker.random.number( { min: 0, max: 9} ).toString() + faker.random.number( { min: 0, max: 9} ).toString();
  return fakeMAC;
};