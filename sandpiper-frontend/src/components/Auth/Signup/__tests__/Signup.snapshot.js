import React from 'react';
import Signup from '../Signup';

describe('Signup', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(
      <Signup />
    );

    expect(wrapper).toMatchSnapshot();
  });
});