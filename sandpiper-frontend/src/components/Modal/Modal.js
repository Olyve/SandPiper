import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import './Modal.css';

export class Modal extends Component {
  render() {
    const messageClasses = cx({
      'modal-message': true,
      'hidden': !this.props.showMessage
    });

    const buttonClasses = cx({
      'modal-buttons': true,
      'hidden': !this.props.showButtons
    });

    return (
      <div className='modal'>
        <div className='modal-popup'>
          <div>
            <h3 className='modal-title'>{this.props.title}</h3>
          </div>
          <div>
            <p className={messageClasses}>
              {this.props.message}
            </p>
          </div>
          <div className={buttonClasses}>
            <button autoFocus className='modal-confirm' onClick={this.props.handleConfirm}>
              Okay
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...state.modal }
}

export default connect(mapStateToProps)(Modal);