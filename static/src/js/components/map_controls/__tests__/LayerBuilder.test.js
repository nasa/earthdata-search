import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { TileLayer } from 'react-leaflet'
import LayerBuilder from '../LayerBuilder'


Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    format: 'jpeg',
    product: 'mock_product',
    projection: 'epsg4326',
    resolution: '500m',
    time: '2019-01-01'
  }

  const enzymeWrapper = shallow(<LayerBuilder {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('LayerBuilder component', () => {
  test('should render self', () => {
    const { enzymeWrapper, props } = setup()
    const tileLayer = enzymeWrapper.find(TileLayer)

    const {
      format,
      product,
      projection,
      resolution,
      time
    } = props
    const projectionResolution = `${projection.toUpperCase()}_${resolution}`

    expect(tileLayer.length).toBe(1)

    // eslint-disable-next-line max-len
    expect(tileLayer.prop('url')).toEqual(`https://gibs.earthdata.nasa.gov/wmts/${projection}/best/${product}/default/${time}/${projectionResolution}/{z}/{y}/{x}.${format}`)
  })
})
