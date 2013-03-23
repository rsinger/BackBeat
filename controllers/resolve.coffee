require 'coffee-script'
async = require 'async'
Rdio = require('rdio-node').Rdio
spotify = require 'spotify'
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
    callback null, response

retrieveServicesFromSpotify = (request, callback) ->
  query = {}
  if request.track_title?
    query.type = "track"
    query.query = "track:\"" + request.track_title + "\""
    if request.artist? then query.query = query.query + " artist:\"" + request.artist + "\""
  else if request.album?
    query.type = 'album'
    query.query = 'album:"'+request.album+'"'
    if request.artist? then query.query = query.query + " artist:\"" + request.artist + "\""
  else if request.artist?
    query.type = 'artist'
    query.query = request.artist
  
  spotify.search query, (err, response) =>
    callback null, response    

retrieveServicesForRequest = (request, callback) ->
  serviceResponses = {}
  retrieveServicesFromRdio request, (err, rdio_response) =>
    serviceResponses.rdio = rdio_response
    retrieveServicesFromSpotify request, (err, spotify_response) =>
      serviceResponses.spotify = spotify_response
      callback null, serviceResponses
  
exports.retrieveServicesForRequest = retrieveServicesForRequest
  