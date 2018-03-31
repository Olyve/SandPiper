import React, { Component } from 'react';
import './Playlist.css';

class Playlist extends Component {
  render() {
      console.log(this.props.playlists)
      let playlists;
      if(this.props.playlists.items && this.props.playlists.items.length > 0){
         playlists = this.props.playlists.items.map((playlist, index) => {
             return <PlaylistSingle key={`playlist-${index}`} data={playlist}/>
         })
      }

    return (
      <div className="playlists">
          {playlists ? playlists : null}
      </div>
    );
  }
}

function PlaylistSingle(props){
    return(
        <div className='playlist-container'>
            <img className='playlist-cover' alt='Playlist mosaic' src={props.data.images[1].url}/>
            <div className='playlist-info'>
                <h2 className='playlist-title'>{props.data.name}</h2>
            </div>
        </div>
    )
}

export default Playlist;
