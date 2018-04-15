import React, { Component } from 'react';
import './Track.css';

class TrackList extends Component {
  constructor(props){
      super(props);

      this.state = {
          site: this.props.site,
          allTracks: [],
          selected: [],
          submitted: [],
      }
  }

  handleSubmit(event) {
      event.preventDefault();
      const filtered = this.state.selected.filter(content => content);
      this.setState({ submitted: filtered })
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
          selected: listCopy,
          checkAll: false
      })
  }

  checkAll(event){
      event.preventDefault();
      this.setState({ checkAll: true, selected: this.allTrackData })
  }

  checkNone(event){
      event.preventDefault();
      this.setState({ checkAll: false, selected: [] })
  }


  cleanTrackData(track){
      let albumImage, trackName, trackUrl, artistName, artistUrl, trackData, id;
      switch(this.props.site){
          case 'spotify':
              trackData = track.track

              id = trackData.external_ids.isrc;
              albumImage = trackData.album.images[0].url || null;
              trackName = trackData.name;
              trackUrl = trackData.external_urls.spotify;
              artistName = trackData.artists[0].name;
              artistUrl = trackData.artists[0].external_urls.spotify;
              break;
          case 'itunes':
              trackData = track.attributes;

              id = trackData.id;
              albumImage = trackData.artwork.url.replace(/(\{\w\})/g, '100');
              trackName = trackData.name;
              trackUrl = null;
              artistName = trackData.artistName;
              artistUrl = null;
              break;
          default:
              return null;
      }

      return({albumImage, trackName, trackUrl, artistName, artistUrl, trackData, id})
  }

  render() {
    const tracks = this.props.tracks;
    const playlist = this.props.playlist

    let trackList = [];
    let allTrackData = [];

    if (tracks !== undefined) {
          trackList = tracks.map((trackData, index) => {
              const data = this.cleanTrackData(trackData);
              allTrackData.push({id: data.id, name: data.trackName});

              return <Track site={this.props.site} key={index} checked={this.state.selected[index]}
                        index={index} add={(id, index) => this.addToQueue(id, index)} data={data}/>
          });

          this.allTrackData = allTrackData;
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

    let selected;
    if(this.state.submitted.length > 0){
        const submitData = this.state.submitted.map((data, index) => {
            return (
                <div>
                    <p>{index + 1} - {data.name}</p>
                </div>
            )
        })

        selected = (
            <div className="selected-tracks">
                <h2 className="selected-tracks-heading">Selected Tracks</h2>
                {submitData}
            </div>

        )
    }
    else{
        selected = <div className="selected-tracks">
            <h2 className="no-tracks">No tracks submitted!</h2>
            <p className="no-tracks">Submit some tracks to populate!</p>
        </div>
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
              {selected}

          </div>
          <form className="tracklist-form" onSubmit={(ev) => this.handleSubmit(ev)}>
              <button className="tracklist-submit" type="submit">Submit</button>
              <button className="tracklist-checkAll" onClick={(ev) => this.checkAll(ev)}>Select All</button>
              <button className="tracklist-checkNone" onClick={(ev) => this.checkNone(ev)}>Reset Selection</button>

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
    return (
      <div className='track'>
        <input type='checkbox' checked={this.props.checked ? true : false} name='track-select' value={this.props.data.id}
                onChange={() => this.props.add({id: this.props.data.id, name: this.props.data.trackName}, this.props.index)}/>
        <div className='track-album'>
          <img src={this.props.data.albumImage} height={100} width={100} alt={'Album artwork.'}/>
        </div>
        <div className='track-details'>
          <a className='track-details-title' href={this.props.data.trackUrl} target='_blank'>{this.props.data.trackName}</a>
          <a className='track-details-artist' href={this.props.data.artistUrl} target='_blank'>{this.props.data.artistName}</a>
        </div>
      </div>
    );
  }
}

export default TrackList;
