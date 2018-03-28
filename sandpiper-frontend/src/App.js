import React, { Component } from 'react';
import { NavLink, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './App.css';
import Auth from './components/Auth';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import { registerUser, loginUser } from './Utilities/networking';
import * as Actions from './Utilities/actions';

export class App extends Component {

  handleSignup(data) {
    // Show modal
    this.props.showLoadingModal();

    registerUser(data)
      .then((json) => {
        // Reset the modal
        this.props.resetModal();

        if (json["status"] !== 'Created') {
          let message = json['messages'].reduce((acc, current) => acc + '\n' + current);
          this.props.showModal(json['status'], message);
        }
        else {
          return this.handleLogin({email: data.email, password: data.password});
        }
      });
  }

  handleLogin(data) {
    // Show Modal
    this.props.showLoadingModal();
    
    // Kick off request to API
    loginUser(data)
      .then((json) => {
        // Reset the modal
        this.props.resetModal();

        // If login was successful add token and user_id to state 
        if (json['status'] === 'Success') {
          console.log(json['data']);
          this.props.updateUser({
            token: json['data']['token'],
            id: json['data']['user_id']
          });

          // Redirect to the home page
          this.props.history.push('/');
        }
        else {
          // Setup new modal state with message for user
          let message = json['messages'].reduce((acc, current) => acc + '\n' + current);
          this.props.showModal(json['status'], message);
        }
      });
  }

  handleConfirm() {
    // Hide the modal
    this.props.resetModal();
  }

  showModal() {
    if (this.props.displayModal) {
      return <Modal handleConfirm={() => this.handleConfirm()} />
    }
  }

  render() {
    return (
      <div>
        <div className='App container'>
          <div className='grid-n'>
            <ul>
              <NavLink exact to='/' activeStyle={{fontWeight: 'bold'}} className='nav-item'>
                Home
              </NavLink>
            </ul>
          </div>

          <div className='grid-l'>
            <ul>
              {loginNavLink(this.props.user.id)}
            </ul>
          </div>
          
          <div className='grid-c'>
            {
            /* 
             * At some point replace the render function with a function to
             * conditionally render a component. It will clean up this cluster of code.
             */
            }
            <Route exact path='/' render={() => {
              if (this.props.user.id !== '') {
                return (<Dashboard />);
              }
              else {
                return (<h3>Please log in to view your dashboard.</h3>);
              }
            }} />
            <Route exact path='/login' render={() => 
              <Auth handleSignup={(i) => this.handleSignup(i)} handleLogin={(i) => this.handleLogin(i)} />
            } />
            <Route path='/profile' render={() => <Profile />} />
          </div>
        </div>
        {/* Modal Popup */}
        {this.showModal()}
      </div>
    );
  }
}

function loginNavLink(user_id) {
  if (user_id !== '') {
    return (
      <NavLink exact to='/profile' activeStyle={{fontWeight: 'bold'}} className='nav-item'>
        Profile
      </NavLink>
    );
  }
  else {
    return (
      <NavLink exact to='/login' activeStyle={{fontWeight: 'bold'}} className='nav-item'>
        Login
      </NavLink>
    );
  }
}

function mapStateToProps(state) {
  return { 
    user: state.user,
    displayModal: state.modal.isVisible 
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
