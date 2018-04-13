import React, { Component } from 'react';
import './Track.css';

class TrackList extends Component {
  constructor(props){
      super(props);

      this.state = {
          site: this.props.site,
          selected: []
      }
  }

  handleSubmit(event) {
      event.preventDefault();
      const filtered = this.state.selected.filter(content => content);
      console.log(filtered);
  }

  addToQueue(id, index){
      let listCopy = this.state.selected.slice();

      if(listCopy.includes(id)){
          listCopy[index] = null;
      }
      else{
          listCopy[index] = id;
      }

      this.setState({
          selected: listCopy
      })
  }

  render() {
    const tracks = this.props.tracks;
    const playlist = this.props.playlist
    var trackList = [];
    if (tracks !== undefined) {
      trackList = tracks.map((trackData, index) => {
        return <Track site={this.props.site} key={index} track={trackData}
                index={index} add={(id, index) => this.addToQueue(id, index)}/>
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
            embed = <iframe title="spotify-playlist" className='tracklist-playlist-embed' width="400" height="280" frameBorder="0" 
                            src={`https://open.spotify.com/embed?uri=${playlist.uri}`} allowtransparency="true" allow="encrypted-media"/>
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
              </div>
              {embed}

          </div>
          <form onSubmit={(ev) => this.handleSubmit(ev)}>
              <input type="submit" value="Submit"/>
              <div className='trackList'>{trackList}</div>
          </form>
      </div>
    );
  }
}

export class Track extends Component {
  componentDidMount() {

  }

  render() {
    let albumImage, trackName, trackUrl, artistName, artistUrl, trackData, id;
    switch(this.props.site){
        case 'spotify':
            trackData = this.props.track.track

            id = trackData.external_ids.isrc;
            albumImage = trackData.album.images[0].url || null;
            trackName = trackData.name;
            trackUrl = trackData.external_urls.spotify;
            artistName = trackData.artists[0].name;
            artistUrl = trackData.artists[0].external_urls.spotify;
            break;
        case 'itunes':
            trackData = this.props.track.attributes;

            id = trackData.id;
            albumImage = trackData.artwork.url.replace(/(\{\w\})/g, '100');
            trackName = trackData.name;
            trackUrl = null;
            artistName = trackData.artistName;
            artistUrl = null;
            break;
        default:
            return (<div>Track not available</div>);
    }



    return (
      <div className='track'>
        <input type='checkbox' name='track-select' value={id}
                onChange={() => this.props.add({id: id, name: trackName}, this.props.index)}/>
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
