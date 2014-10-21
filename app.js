/**
 * Module dependecies
 */

var path = require('path');
var config = require('./config.js')['ntwitter'];
var twitter = require('ntwitter');
var controller = require('./controller.js');
var request = require('request');
var _ = require('underscore');
var async = require('async');

var summary = require('./summary.json');

var _ = require('underscore');

var clean=[];

_.each(summary.devices, function(device, i){
    var sensors=[];
    _.each(device.sensors,function(sensor ,j){
        if(sensor.metric == 'bmp_temperature'){
            var sobj = {
                metric: 'Temperature',
                value: sensor.value,
                unit: 'C'
            }
            sensors.push(sobj);
        }
        else if(sensor.metric == 'illuminance'){
            var sobj = {
                metric: 'Illuminance',
                value: sensor.value,
                unit: 'Lux'
            }
            sensors.push(sobj);
        }
        else if(sensor.metric == 'sht_humidity'){
            var sobj = {
                metric: 'Humidity',
                value: sensor.value,
                unit: '%'
            }
            sensors.push(sobj);
        }
        else if(sensor.metric == 'bmp_pressure'){
            var sobj = {
                metric: 'Pressure',
                value: sensor.value,
                unit: 'hPa'
            }
            sensors.push(sobj);
        }

    })
    var obj = {
        name: device.name,
        sensors: sensors
    }
    clean.push(obj);
})

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//Twitter API Config
var twit = new twitter(config);

var chainSite = 'http://chain-api.media.mit.edu/devices/?limit=100&site_id=7&offset=0';

// Twitter symbols array
var getSite = function(){
    var watch = ['#Tidmarsh'];
    request.get(chainSite, function(error, response, body){
        var data = JSON.parse(body);
        async.each(data._links.items, function(item, callback) {
            watch.push('#'+item.title);
            callback();
        }, function(err) {
        if(err) {
            console.log("There was an error" + err);
        } else {
            startEngine(watch);
        }
        });
    });
}

var startEngine = function(watch){
    credentials = twit.verifyCredentials(function (err, data) {
        if(err) console.log(err);
    });

    credentials.stream('user', {track:watch}, function(stream) {
    	console.log("Twitter stream is ready and waiting for inc tweets...");
    	stream.on('data', function (data) {
    		if (data.text !== undefined) {
    			var name = data.user.screen_name;
                console.log(name);
    			var hashtags = data.entities.hashtags;
                var msg='';
                if(hashtags[0] != undefined && hashtags[0].text.toLowerCase() == 'tidmarsh' && name !='Beamiobot'){
                    for (i=1; i<=12; i++){
                        msg+=watch[getRandomInt(1,70)]+" ";
                    }
                    credentials.updateStatus(msg + " @"+name,
                        function (err, data) {
                            console.log('1');
                            console.log(msg);
                    });
                }
                else if(name != 'Beamiobot'){
                    var checkDevice = false;
                    if(hashtags[0] != undefined){
                        var deviceTag = hashtags[0].text;
                        for(i=0; i<watch.length;i++){
                            if(watch[i]=='#'+deviceTag) checkDevice = true;
                        }
                    }
                    if(checkDevice){
                        msg += deviceTag + ": ";
                        for(j=0; j< clean.length;j++){
                            if(clean[j].name == deviceTag){
                                for(k=0; k<clean[j].sensors.length;k++){
                                    msg += clean[j].sensors[k].metric + ": " + clean[j].sensors[k].value + " " + clean[j].sensors[k].unit+", ";
                                }
                            }

                        }
                        console.log(msg);
                        credentials.updateStatus(msg + " @"+name,
                            function (err, data) {
                                console.log('1');
                        });
                    }
                }

    		}
    	});

    	stream.on('error', function (err, code) {
    		console.log("err: "+err+" "+code)
    	});
    });
}

async.series([
    getSite()
]);
