import React, { Component } from 'react';
import { searchSpotify, getSpotifyPlaylists, getiTunesPlaylists,
        getSpotifyTracks, getiTunesTracks, migratePlaylist  } from '../../Utilities/networking';
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
        if (json['data'] !== undefined) {
          const results = json['data']['results'];
          this.setState({
            tracks: results['tracks']
          });
        }
      });
  }

  handleGetPlaylists(site) {
    switch (site){
        case 'spotify':
            getSpotifyPlaylists(this.props.user.token).then((json) => {this.playlistHelper(json, site)})
            break;
        case 'apple':
            getiTunesPlaylists(this.props.user.token).then((json) => {this.playlistHelper(json, site)})
            break;
        default:
            break;
    }
  }

  playlistHelper(json, site){
      if (json.data !== undefined) {
        const results = json.data.results || json.data.playlists.data;
        this.setState({
          playlists: results,
          site: site
        });
      }
  }

  handleGetTracks(playlistData, site) {
      switch (site){
          case 'spotify':
              getSpotifyTracks(this.props.user.token, playlistData.href).then((json) => {
                  this.trackHelper(json, playlistData, site)
              });
              break;
          case 'apple':
              getiTunesTracks(this.props.user.token, playlistData.id).then((json) => {
                  this.trackHelper(json, playlistData, site)
              });
              break;
          default:
              console.log("ERROR - Cannot retrieve data")
              break;
      }
  }

  trackHelper(json, playlistData, site){
      if (json.data !== undefined) {
        let results;
        switch(site){
            case 'spotify':
                results = json.data.results.tracks.items;
                break;
            case 'apple':
                // NOTE: Something about this feels off
                results = json.data.playlist.data[0].relationships.tracks.data;
                break;
            default:
                results = [];
                break;
        }

        this.setState({
          tracks: results,
          currentPlaylist: playlistData
        });
      }
  }


  resetTrack(){
    this.setState({
        tracks: [],
        currentPlaylist: ''
    })
  }

  resetPlaylist(){
      this.setState({
          search: '',
          site: '',
          playlists: [],
          tracks: [],
          currentPlaylist: ''
      })
  }

  migratePlaylist(source, tracks, name){
      if(tracks.length === 0){
          alert("Tracklist cannot be empty. Please submit tracks and try again.")
      }
      else{
          migratePlaylist(this.props.user.token, source, tracks, name);
      }
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
                    <button className='playlist-iTunes'  onClick={() => this.handleGetPlaylists('apple')}>iTunes</button>
                </div>
            </div>
    }

    // Content of dashboard
    let dashboardContent;
    if(Array.isArray(this.state.tracks) && this.state.tracks.length === 0 && this.state.currentPlaylist === ''){
        dashboardContent = <PlaylistList site={this.state.site} playlists={this.state.playlists} reset={() => this.resetPlaylist()}
                            trackGet={(id) => this.handleGetTracks(id, this.state.site)}/>
    }
    else{
        dashboardContent = <TrackList site={this.state.site} tracks={this.state.tracks} playlist={this.state.currentPlaylist}
                            reset={() => this.resetTrack()} migrate={(source, tracks, name) => this.migratePlaylist(source, tracks, name)}/>
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
