import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, ShapefileUploadModalContainer } from '../ShapefileUploadModalContainer'
import { ShapefileUploadModal } from '../../../components/ShapefileUploadModal/ShapefileUploadModal'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    isOpen: true,
    onToggleShapefileUploadModal: jest.fn()
  }

  const enzymeWrapper = shallow(<ShapefileUploadModalContainer {...props} />)

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

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      ui: {
        shapefileUploadModal: {
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

describe('ShapefileUploadModalContainer component', () => {
  test('passes its props and renders a single FacetsModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(ShapefileUploadModal).length).toBe(1)
    expect(enzymeWrapper.find(ShapefileUploadModal).props().isOpen).toEqual(true)
    expect(typeof enzymeWrapper.find(ShapefileUploadModal).props().onToggleShapefileUploadModal).toEqual('function')
  })
})
