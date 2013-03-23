require 'coffee-script'
async = require 'async'
Rdio = require('rdio-node').Rdio
cfg = require '../config'
retrieveServicesFromRdio = (request, callback) ->
  rdio = new Rdio {consumerKey: cfg.rdio.key, consumerSecret: cfg.rdio.secret}
  query = {}
  if request.track_title?
    query.types = "Track"
    query.query = request.track_title
    if request.artist? then query.query = query.query + " " + request.artist
  else if request.album?
    query.types = 'Album'
    query.query = request.album
    if request.artist? then query.query = query.query + " " + request.artist
  else if request.artist?
    query.types = 'Artist'
    query.query = request.artist
  rdio.makeRequest 'search', query, (err, response) =>
    console.log arguments
    callback null, response
     
  

retrieveServicesForRequest = (request, callback) ->
  serviceResponses = {}
  retrieveServicesFromRdio request, (err, response) =>
    callback null, response
  
exports.retrieveServicesForRequest = retrieveServicesForRequest
  