import React, {Component} from 'react';
import './Splash.css';


class Splash extends Component {
  render() {
      return (
          <div className='splash-cont'>
              <h1 className='splash-title'>Welcome to Sandpiper!</h1>
              <img className='splash-logo' alt='' src='/splash-logo.png'/>
              <h2 className='splash-sub'>Playlist transferring made easy</h2>
              <a onClick={() => this.props.history.push('/login')}>
                <button className='splash-login'>
                  Log in to get started
                </button>
              </a>
          </div>
      )
  }
}


export default Splash;
