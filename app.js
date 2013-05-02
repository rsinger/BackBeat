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
  handleRequest(req, res);
});

app.get('/:artist/:album', function(req,res){
  handleRequest(req, res);
});

app.get('/settings', function(req,res){
  request = {title:["Settings"], settings:req.session};
  res.render('settings',request);
});

app.post('/settings', function(req,res){
  if(!req.session.services)
  {
    req.session.services = {}
  }
  if(req.body['services-rdio'] && !req.session.services.rdio)
  {
    req.session.services.rdio = {enabled:true};
  }
  if(req.body['services-spotify'] && !req.session.services.spotify)
  {
    req.session.services.spotify = {enabled:true};
  }  
  if(req.session.services.spotify && req.session.services.spotify.territory && !req.body['limit-territory'])
  {
    delete(req.session.services.spotify.territory)
  }
  request = {title:["Settings"]};
  res.render('settings-saved',request);
});

app.get('/:artist', function(req,res){
  handleRequest(req, res);
});

function handleRequest(req, res)
{
  var request = new Request();
  request.title = [];
  request.artist = req.params.artist;
  request.title.push(req.params.artist);
  if(req.params.album)
  {
    request.album = req.params.album;
    request.title.push(req.params.album);
  }
  if(req.params.track)
  {
    request.track_title = req.params.track;
    request.title.push(req.params.track);
  }
  
  if(req.session.services)
  {
    request.services = Object.keys(req.session.services);
  } else {
    request.services = ['rdio','spotify'];
  }
  if(req.query && req.query['limit-territory'])
  {
    if(!req.session.services)
    {
      req.session.services = {spotify:{enabled:true}};
    }    
    req.session.services.spotify.territory = req.query['limit-territory'];
  }
  request.title = [request.artist, request.album, request.track_title];
  resolve.retrieveServicesForRequest(request, req.session, function(err, response)
  {
    request.responses = response;    
    res.render('resolve', request);
  });
  
}
app.get('/', function(req,res){
  request = {title:["Welcome"]};
  res.render('welcome',request);
});

app.listen(process.env.PORT || 3000)
console.log('Backbeat started');