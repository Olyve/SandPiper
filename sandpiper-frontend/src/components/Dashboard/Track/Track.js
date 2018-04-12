import React, { Component } from 'react';
import './Track.css';

class TrackList extends Component {

  render() {
    const tracks = this.props.tracks.items;
    var trackList = [];
    console.log(this.props)
    if (tracks !== undefined) {
      trackList = tracks.map((trackData, index) => {
        return <Track key={index} track={trackData.track} />
      });
    }
    return (
      <div className='tracklist-container'>
          <div className='playlist-title'>{this.props.playlist.title}</div>
          <button onClick={this.props.reset}/>
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
