var exec = require('child_process').exec;
var child;
var path = require('path');
var twitter_update_with_media = require('./twitter_update_with_media.js');
var image_dir=path.join(__dirname, 'public/images/');
var config = require('./config.js')['tumw'];
var tuwm = new twitter_update_with_media(config);
var fs = require('fs');

/*
 * @sensor
 * @type Tidmarsh Sensor Node v2.0, MIT Media Lab
 * @type Beam.io Prototype Sensor Node, PiLabs
 * @message The tweet
 * @param name twitter handler
 * @exec raspistill, tweet image
 * @exec baselisten.py, get sensor data
 */
exports.sensor = function(type, message, name){

}
