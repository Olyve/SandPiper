import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Modal } from '../Modal';

describe('Modal Component', () => {
  const handleConfirm = sinon.spy();
  const options = {
    isVisible: true,
    title: 'title',
    showMessage: true,
    message: 'message'
  }
  const wrapper = mount(
    <Modal handleConfirm={handleConfirm} options={options}/>
  );

  afterAll(() => {
    wrapper.unmount();
  });

  describe('Confirm Button', () => {
    const button = wrapper.find('.modal-confirm');

    describe('when clicked', () => {
      it('should call handleConfirm', () => {
        button.simulate('click', { preventDefault: () => {} });
        expect(handleConfirm.calledOnce).toEqual(true);
      });
    });
  });
});