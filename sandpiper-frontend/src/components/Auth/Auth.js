import React, {Component} from 'react';
import Signup from './Signup';
import Login from './Login';
import './Auth.css';


class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLogin: true
    };

    this.toggleView = this.toggleView.bind(this);
  }

  toggleView() {
    this.setState({showLogin: !this.state.showLogin});
  }

  createMessage(message) {
    return (
      <div className='message'>
        <p>
          {message}
          <a onClick={this.toggleView}>click here</a>.
        </p>
      </div>
    );
  }

  render() {
    var component;
    var message;

    if (this.state.showLogin) {
      component = <Login handleLogin={this.props.handleLogin} />;
      message = this.createMessage('If you don\'t have an account');
    }
    else {
      component = <Signup handleSignup={this.props.handleSignup} />;
      message = this.createMessage('If you already have an account');
    }

    return (
      <div className='auth'>
        {component}
        {message}
      </div>
    );
  }
}


export default Auth;
