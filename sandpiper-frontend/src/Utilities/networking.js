import rp from 'request-promise-native';

var base_url = '';
if (process.env.REACT_APP_BASE_URL) {
  // Main server is production mode, but frontend is staging
  base_url = process.env.REACT_APP_BASE_URL;
} else { // Not set or local development
  base_url = 'http://localhost:3000/api';
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

const getSpotifyPlaylists = (token) => {
  return rp.get({
    url: `${base_url}/spotify/playlists`,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    simple: false,
    json: true
  });
};

const getiTunesPlaylists = (token) => {
  return rp.get({
    url: `${base_url}/apple/playlists`,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    simple: false,
    json: true
  });
};

const getSpotifyTracks = (token, url) => {
  return rp.post({
    url: `${base_url}/spotify/playlist/`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: { url: url },
    simple: false,
    json: true
  });
};

const getiTunesTracks = (token, id) => {
  return rp.get({
    url: `${base_url}/apple/playlist/${id}`,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    simple: false,
    json: true
  });
};

const migratePlaylist = (token, transfer, tracks, name) => {
  const cleanedTracks = tracks.map(track => {
      if(typeof track === 'string'){
          return track
      }
      else{
          return JSON.stringify(track)
      }
  });

  return rp.post({
      url: `${base_url}/migrate`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
          source: transfer.source,
          target: transfer.target,
          track_ids: cleanedTracks,
          playlist_name: name
      },
      simple: false,
      json: true
  });
};

export {
  getSpotifyPlaylists,
  getiTunesPlaylists,
  getSpotifyTracks,
  getiTunesTracks,
  migratePlaylist,
  loginUser,
  registerUser,
  searchSpotify,
  spotifyAuth
};
