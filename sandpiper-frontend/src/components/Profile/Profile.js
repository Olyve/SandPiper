import React, { Component } from 'react';
import qs from 'query-string';
import { spotifyAuth } from '../../Utilities/networking';
import './Profile.css';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      client_id: '463cd9dae54d41ff9d2a9d66443db781',
      response_type: 'code',
      redirect_uri: 'http://localhost:3001/profile/callback',
      scope: 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private'
    }
  }

  componentDidMount() {
    const code = qs.parse(location.search).code; //eslint-disable-line no-restricted-globals

    // We have been redirected to the page with code,
    // send code to API to get and store token in DB
    if (code !== undefined) {
      spotifyAuth(this.props.id, this.props.token, {code: code, redirect_uri: this.state.redirect_uri})
        .then((json) => {
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
          redirect_uri = 'redirect_uri=' + this.state.redirect_uri,
          scope = 'scope=' + this.state.scope;
    const url = `https://accounts.spotify.com/${path}?${client_id}&${response_type}&${redirect_uri}&${scope}`;

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
      <div className="profile">
        <h2>Profile Page</h2>
        <div className="profile-content">
            <div className="profile-main-container">
                <h3>UNDER CONSTRUCTION</h3>
                <p>This component will have something soon!</p>
            </div>
            <div className="profile-button-container">
                <div className="profile-logout">
                    <button className="profile-logout-button" onClick={() => this.logout()}>
                        Logout
                    </button>
                </div>
                <div className="profile-connect">
                  <h3>Connect Accounts</h3>
                  <button className="profile-spotify-button" onClick={() => this.authorizeSpotify()}/>
                  <button className="profile-appleMusic-button"
                      onClick={() => this.props.showModal('', 'Please use our Apple application to log-in!')}
                  />

                </div>
            </div>
        </div>
      </div>
    );
  }
}

export default Profile;
