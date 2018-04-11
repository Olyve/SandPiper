import React, { Component } from 'react';
import { searchSpotify, getPlaylists, getTracks} from '../../Utilities/networking';
import './Dashboard.css';
import TrackList from './Track';
import PlaylistList from './Playlist';

// import Playlists from './Playlist';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      tracks: [],
      playlists: []
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

  handleGetPlaylists() {
    getPlaylists(this.props.user.token)
      .then((json) => {
        console.log(json.data.results)
        if (json['data'] !== undefined) {
          const results = json['data']['results'];
          this.setState({
            playlists: results
          });
        }
      });
  }

  handleGetTracks(playlistId) {
      console.log(playlistId)
    getTracks(this.props.user.token, playlistId)
      .then((json) => {
        console.log(json.data.results)
        if (json['data'] !== undefined) {
          const results = json['data']['results'];
          this.setState({
            tracks: results
          });
        }
      });
  }

  render() {
    return (
      <div className='dashboard'>
        <div className='dashboard-playlists'>
          <label className='playlist-label'><span>Get Spotify Playlists</span></label>
          <button className='playlist-submit' onClick={() => this.handleGetPlaylists()}>Get Playlists</button>
        </div>
          <PlaylistList playlists={this.state.playlists} trackGet={(id) => this.handleGetTracks(id)}/>
          <TrackList tracks={this.state.tracks}/>
      </div>
    );
  }
}

export default Dashboard;
