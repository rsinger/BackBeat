// ==UserScript==
// @name        BackBeat
// @namespace   backbeat
// @description An HTML snarfer for music data
// @include     http*
// @require http://code.jquery.com/jquery-1.9.1.min.js
// @require https://gitorious.org/microdatajs/microdatajs/blobs/raw/master/jquery.microdata.js
// @require https://gitorious.org/microdatajs/microdatajs/blobs/raw/master/jquery.microdata.json.js
// @require http://jsonpath.googlecode.com/svn/trunk/src/js/jsonpath.js
// @grant none
// @version     1
// ==/UserScript==

var items = $.microdata.json($(document).items(), function(o) { return o;});

if(items.items.length > 0)
{
  for(item in items.items)
  {
    var types = jsonPath(items.items[item], '$..[?(@.type)]');
    if(types)
    {
      //console.log(types);
      for(var i =0; i < types.length; i++)
      {
        //console.log(types[i]);
        if(types[i].type && types[i].type[0] === "http://schema.org/MusicAlbum")
        {

          $('body').prepend('<a href="http://backbeat.herokuapp.com/' + encodeURIComponent(types[i].properties.byArtist[0].properties.name[0]) + '/' + encodeURIComponent(types[i].properties.name[0]) + '" target="_blank">BackBeat!</a>');
          console.log("ALBUM: " + types[i].properties.name[0] + " By:" + types[i].properties.byArtist[0].properties.name[0]);
          console.log(types[i].properties.byArtist[0].properties.name[0]);
        }
      }
    }
  }
}
