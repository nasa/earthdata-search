import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { SpatialDisplayContainer } from '../SpatialDisplayContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    pointSearch: '',
    boundingBoxSearch: '',
    polygonSearch: ''
  }

  const enzymeWrapper = shallow(<SpatialDisplayContainer {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('SpatialDisplayContainer component', () => {
  test('with no props should render self without display', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe(null)
  })

  test('with pointSearch should render the display spatial info', () => {
    const { enzymeWrapper } = setup()
    const newPoint = '-77.0418825,38.805869' // Lon,Lat
    enzymeWrapper.setProps({ pointSearch: newPoint })

    const spatialDisplay = enzymeWrapper.find('.spatial-display')
    expect(spatialDisplay.text()).toEqual('Point: 38.805869,-77.0418825') // Lat,Lon
  })

  test('with boundingBoxSearch should render the display spatial info', () => {
    const { enzymeWrapper } = setup()
    const newBoundingBox = '-77.119759,38.791645,-76.909393,38.995845' // Lon,Lat,Lon,Lat
    enzymeWrapper.setProps({ boundingBoxSearch: newBoundingBox })

    const spatialDisplay = enzymeWrapper.find('.spatial-display')
    expect(spatialDisplay.text()).toEqual('Rectangle: SW: 38.791645,-77.119759 NE: 38.995845,-76.909393') // Lat,Lon Lat,Lon
  })

  test('with polygonSearch should render the display without spatial info', () => {
    const { enzymeWrapper } = setup()
    const newPolygon = '-77.04444122314453,38.99228142151045,-77.01992797851562,38.79166886339155,-76.89415168762207,38.902629947921575,-77.04444122314453,38.99228142151045'
    enzymeWrapper.setProps({ polygonSearch: newPolygon })

    const spatialDisplay = enzymeWrapper.find('.spatial-display')
    expect(spatialDisplay.text()).toEqual('Polygon')
  })

  test('componentWillReceiveProps sets the state', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.state().pointSearch).toEqual('')
    const newPoint = '0,0'
    enzymeWrapper.setProps({ pointSearch: newPoint })
    expect(enzymeWrapper.state().pointSearch).toEqual(newPoint)
  })
})
