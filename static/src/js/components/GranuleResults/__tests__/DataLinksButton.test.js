import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Dropdown } from 'react-bootstrap'

import { DataLinksButton } from '../GranuleResultsItem'
import Button from '../../Button/Button'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collectionId: 'TEST_ID',
    dataLinks: [
      {
        rel: 'http://linkrel/data#',
        title: 'linktitle',
        href: 'http://linkhref'
      }
    ],
    onMetricsDataAccess: jest.fn(),
    ...overrideProps
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
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe(Button)
  })

  describe('with no granule links', () => {
    test('renders a disabled download button', () => {
      const { enzymeWrapper } = setup({
        dataLinks: []
      })

      expect(enzymeWrapper.find(Button).props().disabled).toBe(true)
      expect(enzymeWrapper.type()).toBe(Button)
    })
  })

  describe('with a single granule link', () => {
    test('calls callback with the correct data on click', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.simulate('click')

      expect(props.onMetricsDataAccess).toHaveBeenCalledTimes(1)
      expect(props.onMetricsDataAccess).toHaveBeenCalledWith({
        collections: [
          { collectionId: 'TEST_ID' }
        ],
        type: 'single_granule_download'
      })
    })

    test('renders the correct element', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.type()).toBe(Button)
    })
  })

  describe('with multiple granule links', () => {
    test('renders the correct element', () => {
      const { enzymeWrapper } = setup({
        dataLinks: [
          {
            rel: 'http://linkrel/data#',
            title: 'linktitle',
            href: 'http://linkhref'
          }, {
            rel: 'http://linkrel2/data#',
            title: 'linktitle2',
            href: 'http://linkhref2'
          }
        ]
      })
      expect(enzymeWrapper.type()).toBe(Dropdown)
    })
  })
})
