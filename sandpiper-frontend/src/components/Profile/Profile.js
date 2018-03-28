import React, { Component } from 'react';
import qs from 'query-string';
import { spotifyAuth } from '../../Utilities/networking';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      client_id: '463cd9dae54d41ff9d2a9d66443db781',
      response_type: 'code',
      redirect_uri: 'http://localhost:3001/profile/callback'
    }
  }

  componentDidMount() {
    const code = qs.parse(location.search).code; //eslint-disable-line no-restricted-globals

    // We have been redirected to the page with code,
    // send code to API to get and store token in DB
    if (code !== undefined) {
      spotifyAuth(this.props.id, this.props.token, {code: code, redirect_uri: this.state.redirect_uri})
        .then((json) => {
          console.log(json['status']);
          // Handle error or success here
          if (json['status'] === 'Sucess') {
            this.props.history.push('/');
          }
        });
    }
  }

  authorizeSpotify() {
    const path = 'authorize',
          client_id = 'client_id=' + this.state.client_id,
          response_type = 'response_type=' + this.state.response_type,
          redirect_uri = 'redirect_uri=' + this.state.redirect_uri;
    const url = `https://accounts.spotify.com/${path}?${client_id}&${response_type}&${redirect_uri}`;

    window.location.href = url;
  }

  logout() {
    // Clear the user from Redux
    this.props.updateUser({id: '', token: ''})

    // Redirect to Homepage
    this.props.history.push('/');
  }

  render() {
    return (
      <div>
        <h2>Profile Page</h2>
        <div>
          <h3>Connect Accounts</h3>
          <button onClick={() => this.authorizeSpotify()}>
            Spotify Login
          </button>
        </div>
        <div>
          <h3>Logout</h3>
          <button onClick={() => this.logout()}>
            Logout
          </button>
        </div>
      </div>
    );
  }
}

export default Profile;