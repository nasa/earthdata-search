import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { TileLayer } from 'react-leaflet'
import moment from 'moment'
import LayerBuilder from '../LayerBuilder'
import projections from '../../../util/map/projections'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    format: 'jpeg',
    product: 'mock_product',
    projection: projections.geographic,
    resolution: '500m',
    time: true
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
      resolution
    } = props

    const yesterday = moment().subtract(1, 'days')
    const date = yesterday.format('YYYY-MM-DD')

    expect(tileLayer.length).toBe(1)

    // eslint-disable-next-line max-len
    expect(tileLayer.prop('url')).toEqual(`https://gibs.earthdata.nasa.gov/wmts/${projection}/best/${product}/default/${date}/${resolution}/{z}/{y}/{x}.${format}`)
  })
})
