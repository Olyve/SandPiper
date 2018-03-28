import React from 'react';
import Login from '../Login';

describe('Login', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(
      <Login />
    );

    expect(wrapper).toMatchSnapshot();
  });
});