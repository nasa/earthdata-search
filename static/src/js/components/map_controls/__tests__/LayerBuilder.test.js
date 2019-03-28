import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { TileLayer } from 'react-leaflet'
import LayerBuilder from '../LayerBuilder'


Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    projection: 'epsg4326',
    product: 'mock_product',
    resolution: '500m',
    format: 'jpeg',
    time: '2019-01-01'
  }

  const enzymeWrapper = shallow(<LayerBuilder {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('LayerBuilder component', () => {
  test('should render self', () => {
    const { enzymeWrapper, props } = setup()
    const tileLayer = enzymeWrapper.find(TileLayer)

    const {
      projection,
      product,
      resolution,
      format,
      time
    } = props
    const projectionResolution = `${projection.toUpperCase()}_${resolution}`

    expect(tileLayer.length).toBe(1)
    expect(tileLayer.prop('url')).toEqual(`https://gibs.earthdata.nasa.gov/wmts/${projection}/best/${product}/default/${time}/${projectionResolution}/{z}/{y}/{x}.${format}`)
  })
})
