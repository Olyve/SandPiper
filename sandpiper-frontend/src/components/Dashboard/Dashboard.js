import React, { Component } from 'react';
import { searchSpotify, getSpotifyPlaylists, getiTunesPlaylists, getSpotifyTracks } from '../../Utilities/networking';
import './Dashboard.css';
import TrackList from './Track';
import PlaylistList from './Playlist';

// import Playlists from './Playlist';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      site: '',
      playlists: [],
      tracks: [],
      currentPlaylist: ''

    }
  }

  onChange(event) {
    let target = event.target;
    let value = target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSearch() {
    searchSpotify(this.props.user.token, this.state.search)
      .then((json) => {
        console.log(json);

        if (json['data'] !== undefined) {
          const results = json['data']['results'];
          this.setState({
            tracks: results['tracks']
          });
        }
      });
  }

  handleGetPlaylists(site) {
    getSpotifyPlaylists(this.props.user.token)
      .then((json) => {
        console.log(json.data.results)
        if (json['data'] !== undefined) {
          const results = json['data']['results'];
          this.setState({
            playlists: results,
            site: site
          });
        }
      });
  }

  handleGetTracks(playlistData) {
    getSpotifyTracks(this.props.user.token, playlistData.id)
      .then((json) => {
        console.log(json.data.results)
        if (json['data'] !== undefined) {
          const results = json['data']['results'];
          this.setState({
            tracks: results['tracks'],
            currentPlaylist: playlistData
          });
        }
      });
  }

  resetTrack(){
      console.log("Reset")
    this.setState({
        tracks: [],
        currentPlaylist: ''
    })
  }

  render() {
    // Button to show playlists
    let showPlaylists;
    if(Array.isArray(this.state.playlists) && this.state.playlists.length === 0){
        showPlaylists =
            <div className='dashboard-playlists'>
                <label className='playlist-label'>
                    <h1>Get Playlists</h1>
                </label>
                <div className='playlist-buttons'>
                    <button className='playlist-spotify' onClick={() => this.handleGetPlaylists('spotify')}>Spotify</button>
                    <button className='playlist-iTunes'>iTunes</button>
                </div>


            </div>
    }

    // Content of dashboard
    let dashboardContent;
    if(Array.isArray(this.state.tracks) && this.state.tracks.length === 0 && this.state.currentPlaylist === ''){
        dashboardContent = <PlaylistList playlists={this.state.playlists} trackGet={(id) => this.handleGetTracks(id)}/>
    }
    else{
        dashboardContent = <TrackList tracks={this.state.tracks} playlist={this.state.currentPlaylist} reset={() => this.resetTrack()}/>
    }

    return (
      <div className='dashboard'>
          {showPlaylists}
          {dashboardContent}
      </div>
    );
  }
}

export default Dashboard;
