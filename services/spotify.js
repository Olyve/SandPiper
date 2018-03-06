const rp = require('request-promise-native');

function search(search_term, token) {
  // Make the request to the API
  return rp.get({
    url: 'https://api.spotify.com/v1/search',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    qs: {
      q: search_term,
      type: 'artist,album,track',
      limit: 5
    },
    simple: false,
    json: true // automatically parses json response string
  });
}

module.exports = {
  search
};