const rp = require('request-promise-native');
const retry = require('retry');
const scopes = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private'
];

function handleExpiredToken(wrapped) {
  let operation = retry.operation({retries: 2});

  return function() {
    // Stores the arguments from wrapped
    var args = arguments;

    // Intecept promise returned from network call so that
    // we can handle the success or error ourselves.
    return new Promise((resolve, reject) => {
      // Attempt the operation
      operation.attempt(function() {
        wrapped.apply(this, args)
          .then((json) => { resolve(json); })
          .catch((err) => {
            // Custom error handling
            if (err.statusCode === 401) {
              handleTokenRefresh(err, operation, args[1], reject);
            }
            reject(err);
          });
      });
    });
  };
}

function handleTokenRefresh(error, operation, user, reject) {
  console.log('USER: ', user);
  // Attempt to refresh the auth token
  refreshAuthToken(user.spotifyRefreshToken)
    .then((json) => {
      // If a new token is returned, update the user and save
      if (json['access_token']) {
        user.spotifyToken = json['access_token'];
        user.save(() => {
          if (operation.retry('Refreshed Token')) { return; }
        });
      }
      else { reject(error); }
    })
    .catch((err) => {
      // Refresh token failed, try operation again
      if (operation.retry(err)) { return; }
      reject(err);
    });
}

// Requests an Auth Token and Refresh Token using code
function getAuthToken(code, redirect_uri) {
  const auth = process.env.SPOTIFY_BASIC_AUTH;
  const scope_string = scopes.reduce((acc, cur) => acc + ' ' + cur);

  return rp.post({
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri,
      scope: scope_string
    },
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    simple: true,
    json: true, // automatically parses json response string
  });
}

function refreshAuthToken(refresh_token) {
  const auth = process.env.SPOTIFY_BASIC_AUTH;
  return rp.post({
    url: 'https://accounts.spotify.com/api/token',
    body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    simple: false,
    json: true
  });
}

// Performs a search using search_term and returns results
const search = handleExpiredToken(function(search_term, user) {
  // Make the request to the API
  return rp.get({
    url: 'https://api.spotify.com/v1/search',
    headers: {
      'Authorization': `Bearer ${user.spotifyToken}`
    },
    qs: {
      q: search_term,
      type: 'artist,album,track',
      limit: 6
    },
    simple: true,
    json: true // automatically parses json response string
  });
});

// Gets the currently logged in user's playlists
const playlists = handleExpiredToken(function(user) {
  // Make request to Spotify API
  return rp.get({
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: {
      'Authorization': `Bearer ${user.spotifyToken}`
    },
    simple: true,
    json: true
  });
});

module.exports = {
  getAuthToken,
  handleExpiredToken,
  playlists,
  refreshAuthToken,
  search
};
