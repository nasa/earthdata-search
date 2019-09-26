import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { GranuleDetailsTab } from '../GranuleDetailsTab'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    location: {
      search: '?test=value'
    },
    onFocusedGranuleChange: jest.fn()
  }

  const enzymeWrapper = shallow(<GranuleDetailsTab {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleDetailsTab component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('span')
    expect(enzymeWrapper.prop('className')).toBe('granule-results-tab')
  })

  test('renders its link correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(PortalLinkContainer).length).toEqual(1)
    expect(enzymeWrapper.find(PortalLinkContainer).prop('className')).toEqual('granule-results-tab__button')
    expect(enzymeWrapper.find(PortalLinkContainer).prop('to')).toEqual({ pathname: '/search/granules', search: '?test=value' })
    expect(enzymeWrapper.find(PortalLinkContainer).prop('children')[1]).toEqual(' Back to Granules')
  })

  describe('onFocusedGranuleChange', () => {
    test('is fired when link is clicked', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.find(PortalLinkContainer).simulate('click')

      expect(props.onFocusedGranuleChange).toHaveBeenCalledTimes(1)
      expect(props.onFocusedGranuleChange).toHaveBeenCalledWith('')
    })
  })
})
