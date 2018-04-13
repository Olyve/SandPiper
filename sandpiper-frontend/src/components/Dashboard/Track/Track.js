import React, { Component } from 'react';
import './Track.css';

class TrackList extends Component {

  render() {
    const tracks = this.props.tracks;
    const playlist = this.props.playlist
    var trackList = [];
    if (tracks !== undefined) {
      trackList = tracks.map((trackData, index) => {
        return <Track site={this.props.site} key={index} track={trackData}/>
      });
    }

    let imageURL, subtitle, name, url, embed;
    switch(this.props.site){
        case 'spotify':
            name = playlist.name;
            url = playlist.external_urls.spotify
            imageURL = playlist.images[0].url;
            subtitle = (
                <div className='playlist-subtitle'>
                    <h3 className='playlist-by'>{`By: ${playlist.owner.display_name}`}</h3>
                    <h3 className='playlist-tracks'>{`${playlist.tracks.total} tracks`}</h3>
                </div>
            )
            embed = <iframe className='tracklist-playlist-embed' src={`https://open.spotify.com/embed?uri=${playlist.uri}`}
                            width="400" height="280" frameBorder="0" allowtransparency="true" allow="encrypted-media"/>
            break;
        case 'itunes':
            name = playlist.attributes.name;
            imageURL = playlist.attributes.artwork.url.replace(/(\{\w\})/g, '150')
            subtitle = (
                <div className='playlist-subtitle'>
                    <h3 className='playlist-description'>
                        {playlist.attributes.description
                            ? playlist.attributes.description.standard
                            : null}
                    </h3>
                </div>
            )
            break;
        default:
            imageURL = null;
            break;
    }

    return (
      <div className='tracklist-container'>
          <div className='tracklist-playlist'>
              <div className='tracklist-playlist-info'>
                  <div className='playlist-img-container'>
                      <img className='playlist-cover' alt='Playlist mosaic' src={imageURL}/>
                      <button onClick={this.props.reset}>Back to playlists</button>
                  </div>
                  <div className='playlist-heading'>
                      <h2 className='playlist-title'><a href={url}>{name}</a></h2>
                      {subtitle}
                  </div>
                  {embed}
              </div>
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
    let albumImage, trackName, trackUrl, artistName, artistUrl;
    console.log(this.props.site)
    switch(this.props.site){
        case 'spotify':
            albumImage = this.props.track.album.images[1].url;
            trackName = this.props.track.name;
            trackUrl = this.props.track.external_urls.spotify;
            artistName = this.props.track.artists[0].name;
            artistUrl = this.props.track.artists[0].external_urls.spotify;
            break;
        case 'itunes':
            console.log("Test", this.props.track)
            albumImage = this.props.track.attributes.artwork.url.replace(/(\{\w\})/g, '100');
            trackName = this.props.track.attributes.name;
            trackUrl = null;
            artistName = this.props.track.attributes.artistName;
            artistUrl = null;
            break;
    }



    return (
      <div className='track'>
        <div className='track-album'>
          <img src={albumImage} height={100} width={100} alt={'Album artwork.'}/>
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
