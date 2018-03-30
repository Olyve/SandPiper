import React, { Component } from 'react';
import qs from 'query-string';
import { spotifyAuth } from '../../Utilities/networking';
import "./Profile.css"

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
      <div className="profile">
        <h2>Profile Page</h2>
        <div className="profile-content">
            <div className="profile-main-container">
                <h3>Name here!</h3>
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
                  <button className="profile-appleMusic-button" onClick={() => alert("Not implemented yet!")}/>

                </div>
            </div>
        </div>
      </div>
    );
  }
}

export default Profile;
