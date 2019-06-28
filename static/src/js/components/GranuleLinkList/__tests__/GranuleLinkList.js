import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { GranuleLinkList } from '../GranuleLinkList'
import Button from '../../Button/Button'

Enzyme.configure({ adapter: new Adapter() })

describe('Granules component', () => {
  function setup() {
    const props = {
      granuleDownload: {
        granuleDownloadLinks: []
      }
    }

    const enzymeWrapper = shallow(<GranuleLinkList {...props} />)

    return {
      enzymeWrapper,
      props
    }
  }

  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })
})

describe('Granules component', () => {
  function setup() {
    const props = {
      granuleDownload: {
        granuleDownloadLinks: [
          'http://google.com'
        ],
        granuleDownloadParams: {
          granule_count: 2
        }
      }
    }

    const enzymeWrapper = shallow(<GranuleLinkList {...props} />)

    return {
      enzymeWrapper,
      props
    }
  }

  test('should render self correctly when loading', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
    expect(enzymeWrapper.find('h4').text()).toBe(
      'Preparing links for download, please wait (parsed 1 of 2)'
    )
    expect(enzymeWrapper.find(Button).length).toEqual(0)
  })
})

describe('Granules component', () => {
  function setup() {
    const props = {
      granuleDownload: {
        granuleDownloadLinks: [
          'http://google.com',
          'http://google.jp'
        ],
        granuleDownloadParams: {
          granule_count: 2
        }
      }
    }

    const enzymeWrapper = shallow(<GranuleLinkList {...props} />)

    return {
      enzymeWrapper,
      props
    }
  }

  test('should render self with links', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
    expect(enzymeWrapper.find('ul.granule-links-list__list li').length).toBe(2)
    expect(enzymeWrapper.find('h4').text()).toBe(
      'Collection granule links have been retrieved'
    )
    expect(enzymeWrapper.find('.granule-links-list__intro').prop('children')[0]).toEqual(
      'Please click the button to download these links'
    )
    expect(enzymeWrapper.find('.granule-links-list__intro').prop('children')[1].type).toEqual(Button)
  })
})
