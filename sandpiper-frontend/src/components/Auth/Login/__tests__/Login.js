import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Login from '../Login';

describe('Login Component', () => {
  const handleLogin = sinon.spy();
  const wrapper = mount(
    <Login handleLogin={handleLogin} />
  );

  afterAll(() => {
    wrapper.unmount();
  });

  // ====================
  //
  // Submit Button
  // 
  // ====================

  describe('Submit Button', () => {
    const button = wrapper.find('button');

    describe('when clicked', () => {
      it('should call handleLogin', () => {
        button.simulate('click', { preventDefault: () => {} });
        expect(handleLogin.calledOnce).toEqual(true);
      });

      it('should pass state to handleSignup', () => {
        button.simulate('click', { preventDefault: () => {} });
        expect(handleLogin.calledWith({email: '', password: ''})).toEqual(true);
      });
    });
  });

  // ====================
  //
  // Form Inputs
  // 
  // ====================

  describe('Form Inputs', () => {
    const email = wrapper.find('input[name="email"]');
    const password = wrapper.find('input[name="password"]');

    describe('When an input value changes', () => {
      it('should update the state', () => {
        // Test email field
        email.simulate('change', { target: { value: 'test@mail.com', name: 'email' } });
        expect(wrapper.state().email).toEqual('test@mail.com');

        // Test password field
        password.simulate('change', { target: { value: 'password', name: 'password' } });
        expect(wrapper.state().password).toEqual('password');
      });
    });

    describe('When the state changes', () => {
      it('should update the input value', () => {
        wrapper.setState({
          email: 'email@email.com',
          password: 'password1234'
        });

        expect(email.instance().value).toEqual('email@email.com');
        expect(password.instance().value).toEqual('password1234');
      });
    });
  });
});