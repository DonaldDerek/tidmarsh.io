var summary = require('./summary.json');

var _ = require('underscore');

var clean=[];

_.each(summary.devices, function(device, i){
    var sensors=[];
    _.each(device.sensors,function(sensor ,j){
        var sobj = {
            metric: sensor.metric,
            value: sensor.value,
            unit: sensor.unit
        }
        sensors.push(sobj);
    })
    var obj = {
        name: device.name,
        sensors: sensors,

    }
    clean.push(obj);
})

console.log(clean);
