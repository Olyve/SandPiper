import rp from 'request-promise-native';

var base_url = ''
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  base_url = 'http://localhost:3000';
} else {
  base_url = 'http://staging-api.sandpiper.ninja';
}

function registerUser(data) {
  return rp.post({
    url: `${base_url}/register`,
    body: data,
    simple: false,
    json: true // automatically parses json response string
  });
}

function loginUser(data) {
  return rp.post({
    url: `${base_url}/login`,
    body: data,
    simple: false,
    json: true
  });
}

function spotifyAuth(id, token, payload) {
  return rp.post({
    uri: `${base_url}/users/${id}/spotifyAuth`,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: {...payload},
    simple: false,
    json: true
  });
}

function searchSpotify(token, search_term) {
  return rp.get({
    uri: `${base_url}/spotify/search`,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    qs: {
      search_term: search_term
    },
    simple: false,
    json: true
  });
}

export { 
  registerUser,
  loginUser, 
  spotifyAuth,
  searchSpotify 
};