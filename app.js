require('coffee-script');
var express = require('express'),
    Request = require('./lib/request').Request,
    resolve = require('./controllers/resolve'),
    moment = require('moment');

    
var app = express();
app.use(express.favicon());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser('exile on main street'));
app.use(express.cookieSession());
app.use(express.bodyParser());
app.get('/resolve', function(req, res){

});

app.get('/:artist/:album/:track', function(req,res){
    var request = new Request();
    request.track_title = req.params.track;
    request.album = req.params.album;
    request.artist = req.params.artist;
    if(req.session.services)
    {
      request.services = Object.keys(req.session.services);
    } else {
      request.services = ['rdio','spotify'];
    }
    request.title = [request.artist, request.album, request.track_title];
    resolve.retrieveServicesForRequest(request, req.session, function(err, response)
    {
      request.responses = response;
      res.render('resolve', request);
    });

});

app.get('/:artist/:album', function(req,res){
  var request = new Request();
  request.album = req.params.album;
  request.artist = req.params.artist;
  if(req.session.services)
  {
    request.services = Object.keys(req.session.services);
  } else {
    request.services = ['rdio','spotify'];
  }
  request.title = [request.artist, request.album];
  resolve.retrieveServicesForRequest(request, req.session, function(err, response)
  {
    request.responses = response;
    res.render('resolve', request);
  });
});

app.get('/settings', function(req,res){
  request = {title:["Settings"], settings:req.session};
  res.render('settings',request);
});

app.post('/settings', function(req,res){
  req.session.services = {}
  if(req.body['services-rdio'])
  {
    req.session.services.rdio = {enabled:true};
  }
  if(req.body['services-spotify'])
  {
    req.session.services.spotify = {enabled:true};
  }  
  request = {title:["Settings"]};
  res.render('settings-saved',request);
});

app.get('/:artist', function(req,res){
  var request = new Request();
  request.artist = req.params.artist;
  if(req.session.services)
  {
    request.services = Object.keys(req.session.services);
  } else {
    request.services = ['rdio','spotify'];
  }
  request.title = [request.artist];
  resolve.retrieveServicesForRequest(request, req.session, function(err, response)
  {
    request.responses = response;
    res.render('resolve', request);
  });
});

app.get('/', function(req,res){
  request = {title:["Welcome"]};
  res.render('welcome',request);
});

app.listen(process.env.PORT || 3000)
console.log('Backbeat started');