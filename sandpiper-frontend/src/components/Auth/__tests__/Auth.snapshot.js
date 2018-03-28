import React from 'react';
import Auth from '../Auth';

describe('Auth', () => {
  it('should render Login by default', () => {
    const wrapper = shallow(
      <Auth />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render Register when showLogin is false', () => {
    const wrapper = shallow(
      <Auth />
    );

    // Find and trigger the button to toggle state
    let submit = wrapper.find('a');
    submit.simulate('click', { preventDefault: () => {} });

    expect(wrapper).toMatchSnapshot();
  });
});