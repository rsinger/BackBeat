Album = require('./album').Album
class Track
  constructor: (@name) ->
    @album = new Album
    
exports.Track = Track