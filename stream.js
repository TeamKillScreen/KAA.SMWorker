var Twitter = require('twitter');
var request = require('request').defaults({ encoding: null });
var crypto = require('crypto');

try {
    config = require('./config');
} catch (ex) {
    config = {}
    config.TwitterConfig = {}
}

var client = new Twitter(config.TwitterConfig);

client.stream('statuses/filter', {locations: '-2.380943,53.438467,-2.025261,53.664464'},  function(stream) {
  stream.on('data', function(tweet) {
    if(tweet.entities.media !== undefined) {
      tweet.entities.media.forEach(function(media) {
        if(media.type == "photo") {
          console.log(media.media_url)

          request.get(media.media_url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                data = new Buffer(body).toString('base64');

                var filename = crypto.createHash('md5').update(media.media_url).digest('hex') + '.jpg';

                console.log(filename);

                requestData = { content: data, filename: filename}

                request({
                  url: config.KAAAPIUrl,
                  method: "POST",
                  headers: {
                      "content-type": "application/json",
                  },
                  json: requestData
                });

            }
          });

        }
      })
    } else {
      //console.log("DISCARD: " + tweet.text)
    }
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
