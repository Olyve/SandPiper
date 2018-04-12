import React, { Component } from 'react';
import './Track.css';

class TrackList extends Component {

  render() {
    const tracks = this.props.tracks.items;
    const playlist = this.props.playlist
    var trackList = [];
    if (tracks !== undefined) {
      trackList = tracks.map((trackData, index) => {
        return <Track key={index} track={trackData.track} />
      });
    }
    return (
      <div className='tracklist-container'>
          <div className='tracklist-playlist'>
              <div className='tracklist-playlist-info'>
                  <div className='playlist-img-container'>
                      <img className='playlist-cover' alt='Playlist mosaic' src={playlist.images[0].url}/>
                      <button onClick={this.props.reset}>Back to playlists</button>
                  </div>

                  <div className='playlist-heading'>
                      <h2 className='playlist-title'>{playlist.name}</h2>
                      <div className='playlist-subtitle'>
                          <h3 className='playlist-by'>By: {playlist.owner.display_name}</h3>
                          <h3 className='playlist-tracks'>{playlist.tracks.total} tracks</h3>
                      </div>
                  </div>
              </div>
                <iframe className='tracklist-playlist-embed' src={`https://open.spotify.com/embed?uri=${playlist.uri}`}
                        width="400" height="280" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
          </div>
          <div className='trackList'>{trackList}</div>
      </div>
    );
  }
}

export class Track extends Component {
  componentDidMount() {

  }

  render() {
    let albumImage = this.props.track.album.images[1] || null,
        trackName = this.props.track.name,
        trackUrl = this.props.track.external_urls.spotify,
        artistName = this.props.track.artists[0].name,
        artistUrl = this.props.track.artists[0].external_urls.spotify;

    return (
      <div className='track'>
        <div className='track-album'>
          <img src={albumImage.url} height={100} width={100} alt={'Album artwork.'}/>
        </div>
        <div className='track-details'>
          <a className='track-details-title' href={trackUrl} target='_blank'>{trackName}</a>
          <a className='track-details-artist' href={artistUrl} target='_blank'>{artistName}</a>
        </div>
      </div>
    );
  }
}

export default TrackList;
