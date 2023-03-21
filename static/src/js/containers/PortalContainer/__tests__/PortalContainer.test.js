import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, PortalContainer } from '../PortalContainer'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const payload = {
    description: 'Example portal only, not for use in EDSC',
    features: {
      advancedSearch: true,
      authentication: true,
      featureFacets: {
        showAvailableInEarthdataCloud: true,
        showCustomizable: true,
        showMapImagery: true
      }
    },
    footer: {
      attributionText: 'NASA Official: Stephen Berrick',
      displayVersion: true,
      primaryLinks: [{
        href: 'http://www.nasa.gov/FOIA/index.html',
        title: 'FOIA'
      }, {
        href: 'http://www.nasa.gov/about/highlights/HP_Privacy.html',
        title: 'NASA Privacy Policy'
      }, {
        href: 'http://www.usa.gov',
        title: 'USA.gov'
      }],
      secondaryLinks: [{
        href: 'https://access.earthdata.nasa.gov/',
        title: 'Earthdata Access: A Section 508 accessible alternative'
      }]
    },
    hasLogo: false,
    hasScripts: false,
    hasStyles: false,
    logo: {},
    // TOOD: Should org be removed?
    // org: 'Earthdata',
    pageTitle: 'Example',
    parentConfig: 'edsc',
    portalBrowser: false,
    portalId: 'example',
    query: {
      echoCollectionId: 'C203234523-LAADS'
    },
    title: {
      primary: 'Earthdata Search'
    },
    ui: {
      showNonEosdisCheckbox: true,
      showOnlyGranulesCheckbox: true,
      showTophat: true
    }
  }

  const props = {
    match: {
      params: { portalId: 'edsc' }
    },
    availablePortals: { default: payload },
    portal: {
      title: {
        primary: 'Example'
      },
      portalId: 'edsc'
    },
    onLoadPortalConfig: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<PortalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('mapDispatchToProps', () => {
  test('onLoadPortalConfig calls actions.loadPortalConfig', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'loadPortalConfig')

    mapDispatchToProps(dispatch).onLoadPortalConfig('portalId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('portalId')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      portal: {}
    }

    const expectedState = {
      portal: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('PortalContainer component', () => {
  test('renders the page title without a portal', () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      env: 'dev',
      defaultPortal: 'edsc'
    }))

    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('title').text()).toEqual('Earthdata Search')
  })

  test('renders the page title with a portal', () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      env: 'dev',
      defaultPortal: 'edsc'
    }))

    const { enzymeWrapper } = setup({
      portal: {
        portalId: 'example',
        title: {
          primary: 'example'
        }
      }
    })

    expect(enzymeWrapper.find('title').text()).toEqual('Earthdata Search :: example Portal')
  })

  test('should call onLoadPortalConfig on mount with a portal', () => {
    const { props } = setup({
      match: {
        params: {
          portalId: 'example'
        }
      }
    })

    expect(props.onLoadPortalConfig.mock.calls.length).toBe(1)
    expect(props.onLoadPortalConfig.mock.calls[0]).toEqual(['example'])
  })
})
