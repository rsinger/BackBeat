require('coffee-script');
var express = require('express'),
    Request = require('./lib/request').Request,
    resolve = require('./controllers/resolve');

    
var app = express();

app.get('/resolve', function(req, res){

});

app.get('/:artist/:album/:track', function(req,res){
    var request = new Request();
    request.track_title = req.params.track;
    request.album = req.params.album;
    request.artist = req.params.artist;
    request.services = ['rdio','spotify'];
    resolve.retrieveServicesForRequest(request, function(err, response)
    {
        res.json(response);      
    });

});

app.get('/:artist/:album', function(req,res){
  var request = new Request();
  request.album = req.params.album;
  request.artist = req.params.artist;
  request.services = ['rdio','spotify'];
  resolve.retrieveServicesForRequest(request, function(err, response)
  {
      res.json(response);      
  });  
});

app.get('/favicon.ico', function(req,res) {});
app.get('/:artist', function(req,res){
  var request = new Request();
  request.artist = req.params.artist;
  request.services = ['rdio','spotify'];
  resolve.retrieveServicesForRequest(request, function(err, response)
  {
      res.json(response);      
  });  
});

app.listen(3000);
console.log('Listening on port 3000');