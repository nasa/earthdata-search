import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, AboutCSDAModalContainer } from '../AboutCSDAModalContainer'
import { AboutCSDAModal } from '../../../components/AboutCSDAModal/AboutCSDAModal'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    isOpen: true,
    onToggleAboutCSDAModal: jest.fn()
  }

  const enzymeWrapper = shallow(<AboutCSDAModalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onToggleAboutCSDAModal calls actions.toggleAboutCSDAModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAboutCSDAModal')

    mapDispatchToProps(dispatch).onToggleAboutCSDAModal(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      ui: {
        aboutCSDAModal: {
          isOpen: false
        }
      }
    }

    const expectedState = {
      isOpen: false
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('AboutCSDAModalContainer component', () => {
  test('passes its props and renders a single AboutCSDAModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AboutCSDAModal).length).toBe(1)
    expect(enzymeWrapper.find(AboutCSDAModal).props().isOpen).toEqual(true)
    expect(typeof enzymeWrapper.find(AboutCSDAModal).props().onToggleAboutCSDAModal).toEqual('function')
  })
})
