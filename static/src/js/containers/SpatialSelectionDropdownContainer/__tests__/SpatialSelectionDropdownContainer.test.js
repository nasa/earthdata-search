import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, SpatialSelectionDropdownContainer } from '../SpatialSelectionDropdownContainer'
import SpatialSelectionDropdown from '../../../components/SpatialDisplay/SpatialSelectionDropdown'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onToggleShapefileUploadModal: jest.fn()
  }

  const enzymeWrapper = shallow(<SpatialSelectionDropdownContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onToggleShapefileUploadModal calls actions.toggleShapefileUploadModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleShapefileUploadModal')

    mapDispatchToProps(dispatch).onToggleShapefileUploadModal(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })
})

describe('SpatialSelectionDropdownContainer component', () => {
  test('passes its props and renders a single SpatialSelectionDropdown component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(SpatialSelectionDropdown).length).toBe(1)
    expect(typeof enzymeWrapper.find(SpatialSelectionDropdown).props().onToggleShapefileUploadModal).toEqual('function')
  })
})
