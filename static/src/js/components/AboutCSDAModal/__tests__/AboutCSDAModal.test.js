import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import AboutCSDAModal from '../AboutCSDAModal'
import EDSCModalContainer from '../../../containers/EDSCModalContainer/EDSCModalContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    isOpen: false,
    onToggleAboutCSDAModal: jest.fn()
  }

  const enzymeWrapper = shallow(<AboutCSDAModal {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AboutCSDAModal component', () => {
  test('should render a Modal', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCModalContainer).length).toEqual(1)
  })

  test('should render a title', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCModalContainer).prop('title')).toEqual('What\'s the NASA Commercial Smallsat Data Acquisition (CSDA) Program?')
  })

  test('should render information', () => {
    const { enzymeWrapper } = setup()

    const message = enzymeWrapper.find(EDSCModalContainer).prop('body').props.children[0].props.children

    expect(message).toContain('The Commercial Smallsat Data Acquisition (CSDA) Program')
  })
})
