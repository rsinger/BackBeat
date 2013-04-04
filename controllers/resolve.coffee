require 'coffee-script'
async = require 'async'
Rdio = require('rdio-node').Rdio
spotify = require 'spotify'
cfg = require '../config'
Artist = require('../models/artist').Artist
Album = require('../models/album').Album
Track = require('../models/track').Track

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
    results = {}
    if response.status? and response.status is "ok"
      for result in response.result.results
        if result.canStream or query.types is "Artist"
          if query.types is "Artist"
            result.artistKey = result.key
          unless results[result.artistKey]?
            results[result.artistKey] = new Artist
            if query.types is "Artist"
              results[result.artistKey].key = result.key
              results[result.artistKey].name = result.name
              results[result.artistKey].url = "http://rdio.com" + result.url              
            else 
              results[result.artistKey].key = result.artistKey
              results[result.artistKey].name = result.artist
              results[result.artistKey].url = "http://rdio.com" + result.artistUrl

          if result.trackNum?
            album = new Album
            album.key = result.albumKey
            album.name = result.album
            album.url = "http://rdio.com" + result.albumUrl
            album.image = result.icon            
            track = new Track
            track.key = result.key
            track.name = result.name
            track.length = result.duration
            track.url = "http://rdio.com" + result.url
            track.album = album
            track.number = result.trackNum
            results[result.artistKey].results.push track
          else if result.trackKeys
            album = new Album
            album.key = result.key
            album.name = result.name
            album.url = "http://rdio.com" + result.url
            album.image = result.icon
            results[result.artistKey].results.push album 
      callback null, results           
    else 
      callback null, results

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
    console.log(err)
    results = {}
    if response? and response.info?
      if query.type is 'artist'
        for result in response.artists
          unless results[result.href]
            results[result.href] = new Artist
            results[result.href].name = result.name
            results[result.href].key = result.href
            results[result.href].url = result.href
      else if query.type is 'album'
        for result in response.albums
          for artist in result.artists
            unless results[artist.href]
              results[artist.href] = new Artist
              results[artist.href].name = artist.name
              results[artist.href].key = artist.href
              results[artist.href].url = artist.href 
            album = new Album
            album.key = result.href 
            album.name = result.name
            album.url = result.href
            album.availability = result.availability.territories
            results[artist.href].results.push album
      else if query.type is 'track'
        for result in response.tracks
          for artist in result.artists
            unless results[artist.href]
              results[artist.href] = new Artist
              results[artist.href].name = artist.name
              results[artist.href].key = artist.href
              results[artist.href].url = artist.href 
            track = new Track
            track.key = result.href
            track.url = result.href  
            track.name = result.name
            track.number = result['track-number']
            track.length = result.length
            if result.album?
              track.album.name = result.album.name      
              track.album.key = result.album.href
              track.album.url = result.album.href
              track.album.availability = result.album.availability.territories
              track.album.date = result.album.released
            results[artist.href].results.push track        
      callback null, results        
    else 
      callback null, results

retrieveServicesForRequest = (request, callback) ->
  serviceResponses = {}
  retrieveServicesFromRdio request, (err, rdio_response) =>
    serviceResponses.rdio = rdio_response
    retrieveServicesFromSpotify request, (err, spotify_response) =>
      serviceResponses.spotify = spotify_response
      callback null, serviceResponses
  
exports.retrieveServicesForRequest = retrieveServicesForRequest
  