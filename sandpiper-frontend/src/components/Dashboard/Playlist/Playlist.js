import React, { Component } from 'react';
import './Playlist.css';

class PlaylistList extends Component {
  render() {
      let playlists;
      if(this.props.playlists.items && this.props.playlists.items.length > 0){
         playlists = this.props.playlists.items.map((playlist, index) => {
             return <Playlist key={`playlist-${index}`} data={playlist} trackGet={(id) => this.props.trackGet(id)}/>
         })
      }

    return (
      <div className="playlistList">
          {playlists ? playlists : null}
      </div>
    );
  }
}

function Playlist(props){
    return(
        <div className='playlist-container'
             onClick={() => props.trackGet(props.data)}>
            <img className='playlist-cover' alt='Playlist mosaic' src={props.data.images[0].url}/>
            <div className='playlist-info'>
                <h2 className='playlist-title'>{props.data.name}</h2>
                <div className='playlist-subtitle'>
                    <h3 className='playlist-by'>By: {props.data.owner.display_name}</h3>
                    <h3 className='playlist-tracks'>{props.data.tracks.total} tracks</h3>
                </div>
            </div>
        </div>
    )
}

export default PlaylistList;
