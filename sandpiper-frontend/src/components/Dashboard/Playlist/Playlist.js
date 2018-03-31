import React, { Component } from 'react';
import './Playlist.css';


class Playlist extends Component {
  render() {
      console.log(this.props.playlists)
      let playlists;
      if(this.props.playlists.items && this.props.playlists.items.length > 0){
         playlists = this.props.playlists.items.map((playlist, index) => {
             return <PlaylistSingle data={playlist}/>
         })
      }

    return (
      <div>
          {playlists ? playlists : null}
      </div>
    );
  }
}

function PlaylistSingle(props){
    console.log("Getting in?")
    return(
        <div>
            <img src={props.data.images[0].url}/>
            <h2>{props.data.name}</h2>
        </div>
    )
}

export default Playlist;
