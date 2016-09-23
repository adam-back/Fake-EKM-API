var express = require( 'express' );
var router = express.Router();
var controller = require( '../controllers/push.controller.js' );

router.route( '/readMeter/:version/key/:key/count/1/format/json' )
  .get( controller.getRealTimeData );

router.route( '/readMeter/:version/key/:key/count/1/format/json/meters/:meters' )
  .get( controller.getDataForSomeMeters );

module.exports = router;


