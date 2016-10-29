var Twitter = require('twitter');

try {
    config = require('./config');
} catch (ex) {
    config = {}
    config.TwitterConfig = {}
}

var client = new Twitter(config.TwitterConfig);

var geolong = 53.477176;
var geolat = -2.254826;
var geodist = "1mi"

var geocodestr = geolong + ',' + geolat + ',' + geodist;

var params = {screen_name: 'nodejs'};
client.get('search/tweets', {q: 'filter:images', geocode:geocodestr}, function(error, tweets, response) {
   console.log(tweets)
   tweets.statuses.forEach(function(status) {
     if(status.entities.media !== undefined) {
       status.entities.media.forEach(function(media) {
         if(media.type == "photo") {
           console.log(media.media_url)
         }
       })
     }
   })
});