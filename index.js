var qo = require('query-overpass');
var gm = require('geojson-merge');
var fs = require('fs');
module.exports = function(array, layer, numSlices, directory, timeout, callback){
  var minX = array[1];
  var minY = array[0];
  var maxX = array[3];
  var maxY = array[2];

  var lngIncrement = (maxY - minY) / numSlices;
  var latIncrement = (maxX - minX) / numSlices;
  var lngInit = minY;
  var latInit = minX;
  var returnedGeoJSON = [];

  var makeRequest = function(query){
    return function(cb){
      qo(query, function(error, data){
        if(error){
          console.log(error);
          return cb(error);
        }
        cb(data);
        // console.log(data);
        console.log('data received');
      });
    };
  };

  function composeRequests(){
    var queries = [];
    while ((latInit + latIncrement) <= maxX){
      var currLng = lngInit;
      while ((currLng + lngIncrement) <= maxY){
        var geoCoordString = currLng + ',' + latInit + ',' + (currLng + lngIncrement) + ',' + (latInit + latIncrement);
        var query = '[out:json][timeout:' + timeout + '];(node["' + layer + '"](' + geoCoordString + ');way["' + layer + '"](' + geoCoordString + ');relation["' + layer + '"](' + geoCoordString + '););out body;>;out skel qt;';
        queries.push(makeRequest(query));
        currLng += lngIncrement;
      }
      latInit += latIncrement;
    }
    return queries;
  }


  function timeBetweenRequest(){
    return timeout;
  }

  function requester(requests, timeBetween, callback) {
    var i = 0;
    var t = timeBetween;
    var responses = [];
    var oneQueryDone = function(data){
      responses.push(data);
      console.log(requests.length, responses.length);
      if(requests.length === responses.length){
        callback(responses);
      }
    };
    requests.forEach(function(r) {
      setTimeout(function() {
        r(oneQueryDone);
      }, timeBetween);
      t += timeBetween;
    });
  }

  requester(composeRequests(), timeBetweenRequest(), function(responses){
    // var results = gm(responses);
    console.log('IM RESULTS');
    var results = JSON.stringify(gm(responses), null, 2);
    fs.writeFile(directory, results, function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
  });
};



  //convert this into a range;





  // var fullGeoJSON = gm(returnedGeoJSON);
  // if (!!directory) {
  //   fs.writeFile(directory, fullGeoJSON);
  // }

  // if(!!callback){
  //   callback(fullGeoJSON);
  // };

//   > function twosums(array){
//     var queries = [];
//     debugger;
//  var diff1 = (array[2] - minY) / 10;
//  var diff2 = (array[3] - minX) / 10;
//  var initx = array[1];
//  var inity = array[0];
//  while (array[3] >= (initx + diff2)){

//   var curry = inity

//  while (array[2] >= (curry + diff1)){
//  queries.push([curry, initx, curry + diff1, initx + diff2])
//  curry += diff1;
//  }
//  console.log(initx);
//  initx += diff2;
//  }
// return queries;
// }


