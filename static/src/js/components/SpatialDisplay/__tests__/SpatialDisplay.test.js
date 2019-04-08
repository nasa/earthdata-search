import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import SpatialDisplay from '../SpatialDisplay'
import FilterStackItem from '../../FilterStack/FilterStackItem'
import FilterStackContents from '../../FilterStack/FilterStackContents'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    boundingBoxSearch: '',
    drawingNewLayer: '',
    pointSearch: '',
    polygonSearch: ''
  }

  const enzymeWrapper = shallow(<SpatialDisplay {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SpatialDisplay component', () => {
  test('with no props should render self without display', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.type()).toBe(null)
  })

  test('with pointSearch should render the spatial info', () => {
    const { enzymeWrapper } = setup()
    const newPoint = '-77.0418825,38.805869' // Lon,Lat
    enzymeWrapper.setProps({ pointSearch: newPoint })

    const filterStackItem = enzymeWrapper.find(FilterStackItem)
    const filterStackContents = enzymeWrapper.find(FilterStackContents)

    expect(filterStackItem.props().title).toEqual('Spatial')
    expect(filterStackItem.props().icon).toEqual('crop')
    expect(filterStackContents.props().title).toEqual('Point')
    expect(filterStackContents.props().body.props.value).toEqual('38.80586900, -77.04188250') // Lat,Lon
  })

  test('with boundingBoxSearch should render the spatial info', () => {
    const { enzymeWrapper } = setup()
    const newBoundingBox = '-77.119759,38.791645,-76.909393,38.995845' // Lon,Lat,Lon,Lat
    enzymeWrapper.setProps({ boundingBoxSearch: newBoundingBox })

    const filterStackItem = enzymeWrapper.find(FilterStackItem)
    const filterStackContents = enzymeWrapper.find(FilterStackContents)

    expect(filterStackItem.props().title).toEqual('Spatial')
    expect(filterStackItem.props().icon).toEqual('crop')
    expect(filterStackContents.props().title).toEqual('Rectangle')
    expect(filterStackContents.props().body.props.value).toEqual('SW: 38.79165, -77.11976 NE: 38.99585, -76.90939') // Lat,Lon Lat,Lon
  })

  test('with polygonSearch should render without spatial info', () => {
    const { enzymeWrapper } = setup()
    const newPolygon = '-77.04444122314453,38.99228142151045,-77.01992797851562,38.79166886339155,-76.89415168762207,38.902629947921575,-77.04444122314453,38.99228142151045'
    enzymeWrapper.setProps({ polygonSearch: newPolygon })

    const filterStackItem = enzymeWrapper.find(FilterStackItem)
    const filterStackContents = enzymeWrapper.find(FilterStackContents)

    expect(filterStackItem.props().title).toEqual('Spatial')
    expect(filterStackItem.props().icon).toEqual('crop')
    expect(filterStackContents.props().title).toEqual('Polygon')
    expect(filterStackContents.props().body.props.value).toEqual(newPolygon) // Points
  })

  test('componentWillReceiveProps sets the state', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.state().pointSearch).toEqual('')
    const newPoint = '0,0'
    enzymeWrapper.setProps({ pointSearch: newPoint })
    expect(enzymeWrapper.state().pointSearch).toEqual(newPoint)
  })
})
