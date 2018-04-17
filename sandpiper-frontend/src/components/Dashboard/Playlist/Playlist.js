import React, { Component } from 'react';
import './Playlist.css';

class PlaylistList extends Component {
  constructor(props){
      super(props);
  }

  handleSpotify(){
      if(this.props.playlists.items && this.props.playlists.items.length > 0){
        return this.props.playlists.items.map((playlist, index) => {
             return <Playlist key={`playlist-${index}`} data={playlist} type="spotify"
                 reset={() => this.props.resetModal()} trackGet={(id) => this.props.trackGet(id)}/>
         })
      }

  }

  handleiTunes(){
      if(this.props.playlists && this.props.playlists.length > 0){
          return this.props.playlists.map((playlist, index) => {
              return <Playlist key={`playlist-${index}`} data={playlist} type="apple" trackGet={(id) => this.props.trackGet(id)}/>
          })
      }
  }

  render() {
      let playlists, content;

      switch(this.props.site){
          case 'spotify':
              playlists = this.handleSpotify();
              break;
          case 'apple':
              playlists = this.handleiTunes();
              break;
          default:
              playlists = null;
              break;
      }

      if(playlists){
          content =
            <div className="playlistList-container">
                <button className="playlistList-reset" onClick={this.props.reset}>
                    Back to site select
                </button>
                <div className="playlistList">
                    {playlists}
                </div>
            </div>
      }

    return content || null;
  }
}

function Playlist(props){
    let imageURL, subtitle, name;
    switch(props.type){
        case 'spotify':
            name = props.data.name;
            imageURL = props.data.images[0].url;
            subtitle = (
                <div className='playlist-subtitle'>
                    <h3 className='playlist-by'>{`By: ${props.data.owner.display_name}`}</h3>
                    <h3 className='playlist-tracks'>{`${props.data.tracks.total} tracks`}</h3>
                </div>
            )
            break;
        case 'apple':
            name = props.data.attributes.name;
            imageURL = props.data.attributes.artwork.url.replace(/(\{\w\})/g, '150')
            subtitle = (
                <div className='playlist-subtitle'>
                    <h3 className='playlist-description'>
                        {props.data.attributes.description ? props.data.attributes.description.standard : null}
                    </h3>
                </div>
            )
            break;
        default:
            imageURL = null;
            break;
    }

    return(
        <div className='playlist-container' onClick={() => props.trackGet(props.data)}>
            <img className='playlist-cover' alt='Playlist mosaic' src={imageURL}/>
            <div className='playlist-heading'>
                <h2 className='playlist-title'>{name}</h2>
                {subtitle}
            </div>
        </div>
    )
}

export default PlaylistList;
