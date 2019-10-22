import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { DataLinksButton } from '../GranuleResultsItem'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionId: 'TEST_ID',
    dataLinks: [
      {
        rel: 'http://linkrel/data#',
        title: 'linktitle',
        href: 'http://linkhref'
      }
    ],
    onMetricsDataAccess: jest.fn()
  }

  const enzymeWrapper = shallow(<DataLinksButton {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('DataLinksButton component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup('cmr')

    expect(enzymeWrapper.type()).toBe('a')
  })

  describe('download button', () => {
    test('calls callback with the correct data on click', () => {
      const { enzymeWrapper, props } = setup('cmr')

      enzymeWrapper.simulate('click')

      expect(props.onMetricsDataAccess).toHaveBeenCalledTimes(1)
      expect(props.onMetricsDataAccess).toHaveBeenCalledWith({
        collections: [
          { collectionId: 'TEST_ID' }
        ],
        type: 'single_granule_download'
      })
    })
  })
})
