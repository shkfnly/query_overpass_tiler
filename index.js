var qo = require('query-overpass');
var gm = require('geojson-merge');
var fs = require('
module.exports = function([lngMin, latMin, lngMax, latMax], layer, numSlices, directory, callback){
  var lngIncrement = (lngMax - lngMin) / numSlices;
  var latIncrement = (latMax - latMin) / numSlices;
  var lngInit = lngMin;
  var latInit = latMin;
  var returnedGeoJSON = [];
  while ((lngInit + lngIncrement) <= lngMax){
    var geoCoordString = lngInit + ',' + latinit + ',' + (lngInit + lngIncrement) + ',' + (latInit + latIncrement);
    var query = '[out:json][timeout:1000];(node["' + layer + '"](' + geoCoordString + ');way["' + layer + '"](' + geoCoordString + ');relation["' + layer + '"](' + geoCoordString + '););out body;>;out skel qt;';
    qo(query, function(error, data){
      if(error){
        return console.log(error);
      }
      returnedGeoJSON.push(data);
      console.log('data was retrieved')
    
    }
    lngInit += lngIncrement;
    latInit += latIncrement;
  }
  fs.write(directory, gm(returnedGeoJSON));
  return console.log('This is testing')
}
