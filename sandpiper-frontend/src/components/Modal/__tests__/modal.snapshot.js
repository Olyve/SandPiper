import React from 'react';
import { Modal } from '../Modal';

describe('Modal', () => {
  it('should render without crashing', () => {
    let options = {
      isVisible: true,
      title: '',
      showMessage: true,
      message: '',
      showButtons: true
    };
    const wrapper = shallow(<Modal {...options} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should hide message when showMessage is false', () => {
    let options = {
      isVisible: true,
      title: '',
      showMessage: false,
      message: '',
      showButtons: true
    };
    const wrapper = shallow(<Modal {...options} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should hide buttons when showButtons is false', () => {
    let options = {
      isVisible: true,
      title: '',
      showMessage: true,
      message: '',
      showButtons: false
    };
    const wrapper = shallow(<Modal {...options} />);

    expect(wrapper).toMatchSnapshot();
  });
});