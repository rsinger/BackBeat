// ==UserScript==
// @name        BackBeat
// @namespace   backbeat
// @description An HTML snarfer for music data
// @include     http://*
// @require http://code.jquery.com/jquery-1.9.1.min.js
// @require http://code.jquery.com/ui/1.10.2/jquery-ui.js
// @require https://gitorious.org/microdatajs/microdatajs/blobs/raw/master/jquery.microdata.js
// @require https://gitorious.org/microdatajs/microdatajs/blobs/raw/master/jquery.microdata.json.js
// @require http://jsonpath.googlecode.com/svn/trunk/src/js/jsonpath.js
// @grant none
// @version     1
// ==/UserScript==

var items = $.microdata.json($(document).items(), function(o) { return o;});
var artists = {};
var match = false;
var nextIsItem = false;
var artName;
var alName;
function getArtistName(artistObj)
{
    var name;
    if(artistObj.properties)
    {
        name = artistObj.properties.name[0];
    } else if(artistObj.name)
    {
        name = artistObj.name
    } else {
        name = artistObj;
    }
    return $.trim(name);
}

function getAlbumName(albumObj)
{
    console.log(albumObj);
    var name;
    if(albumObj.properties)
    {
        name = albumObj.properties.name[0];
    } else if(albumObj.name)
    {
        name = albumObj.name[0]
    } else {
        name = albumObj;
    }
    return $.trim(name);    
}

if(items.items.length > 0)
{
  var item;
  for(item in items.items)
  {
    var types = jsonPath(items.items[item], '$..[?(@.type)]');
    if(types)
    {
      for(var i =0; i < types.length; i++)
      {
        //console.log(types[i]);
        if(types[i].type && types[i].type[0] === "http://schema.org/MusicAlbum" || nextIsItem)
        {
          match = true;
          if(types[i].properties)
          {
            artName = getArtistName(types[i].properties.byArtist[0]);

          } else {
            artName = getArtistName(types[i].byArtist[0]);
          }
          alName = getAlbumName(types[i]);
          
          if(artName)
          {
              if(!artists[artName])
              {
                  artists[artName] = {};
              }
              if(alName)
              {
                  if(!artists[artName][alName])
                  {
                      artists[artName][alName] = []
                  }
              }
                  
          }    
          nextIsItem = false;
        } else if(types[i][0] == "http://schema.org/MusicAlbum")
        {
          nextIsItem = true;
        }
      }
    }
  }
}
//console.log(items);
if(match)
{
  // GM_addStyle("#GM_BackBeatMenu { position: absolute; left: 1px; top: 50%; }");
  $('head').append('<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.2/themes/smoothness/jquery-ui.css" />');
  $('body').append('<ul id="GM_BackBeatMenu"><li>Backbeat!<ul id="GM_BackBeatArtistMenu"></ul></li></ul>');
  var artCnt = 0;
  for(artist in artists)
  {
    $('#GM_BackBeatArtistMenu').append('<li id="GM_BackBeatArtist_' +artCnt + '"><a href="http://backbeat.herokuapp.com/' + encodeURIComponent(artist) + '" target="_blank">' + artist + '</a></li>');
    if(Object.keys(artists[artist]).length > 0)
    {
        $('#GM_BackBeatArtist_' +artCnt).append('<ul id="GM_BackBeatArtist_' +artCnt + '_Albums"></ul>');
    }
    for(album in artists[artist])
    {
      $('#GM_BackBeatArtist_' +artCnt + '_Albums').append('<li><a href="http://backbeat.herokuapp.com/' + encodeURIComponent(artist) + '/' + encodeURIComponent(album) + '" target="_blank">' + album + '</a></li>');
    }
    artCnt++;
  }
  
  $('#GM_BackBeatMenu').css({'position': 'absolute', 'left':'1px', 'top':'50%'});
  $("#GM_BackBeatMenu").menu();
  
}
