require('coffee-script');
var express = require('express'),
    Request = require('./lib/request').Request,
    resolve = require('./controllers/resolve');

    
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/resolve', function(req, res){

});

app.get('/:artist/:album/:track', function(req,res){
    var request = new Request();
    request.track_title = req.params.track;
    request.album = req.params.album;
    request.artist = req.params.artist;
    request.services = ['rdio','spotify'];
    request.title = [request.artist, request.album, request.track_title];
    resolve.retrieveServicesForRequest(request, function(err, response)
    {
      request.responses = response;
      res.render('resolve', request);
    });

});

app.get('/:artist/:album', function(req,res){
  var request = new Request();
  request.album = req.params.album;
  request.artist = req.params.artist;
  request.services = ['rdio','spotify'];
  request.title = [request.artist, request.album];
  resolve.retrieveServicesForRequest(request, function(err, response)
  {
    request.responses = response;
    res.render('resolve', request);
  });
});

app.get('/favicon.ico', function(req,res) {});
app.get('/:artist', function(req,res){
  var request = new Request();
  request.artist = req.params.artist;
  request.services = ['rdio','spotify'];
  request.title = [request.artist];
  resolve.retrieveServicesForRequest(request, function(err, response)
  {
    request.responses = response;
    res.render('resolve', request);
  });
});

app.listen(3000);
console.log('Listening on port 3000');