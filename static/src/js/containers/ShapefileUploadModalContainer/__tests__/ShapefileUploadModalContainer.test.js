import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { ShapefileUploadModalContainer } from '../ShapefileUploadModalContainer'
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

describe('ShapefileUploadModalContainer component', () => {
  test('passes its props and renders a single FacetsModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(ShapefileUploadModal).length).toBe(1)
    expect(enzymeWrapper.find(ShapefileUploadModal).props().isOpen).toEqual(true)
    expect(typeof enzymeWrapper.find(ShapefileUploadModal).props().onToggleShapefileUploadModal).toEqual('function')
  })
})
