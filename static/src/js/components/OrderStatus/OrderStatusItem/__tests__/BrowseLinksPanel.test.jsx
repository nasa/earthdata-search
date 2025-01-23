import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { ProgressBar } from 'react-bootstrap'

import { BrowseLinksPanel } from '../BrowseLinksPanel'
import { TextWindowActions } from '../../../TextWindowActions/TextWindowActions'

jest.useFakeTimers({ legacyFakeTimers: true })

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

describe('BrowseLinksPanel', () => {
  describe('when panel is not provided granule links', () => {
    test('renders placeholder message', () => {
      const enzymeWrapper = shallow(
        <BrowseLinksPanel
          accessMethodType="download"
          earthdataEnvironment="prod"
          browseUrls={[]}
          retrievalId="1"
          granuleCount={100}
          granuleLinksIsLoading={false}
        />
      )

      expect(enzymeWrapper.hasClass('order-status-item__tab-intro')).toEqual(true)
      expect(enzymeWrapper.find('.order-status-item__tab-intro').text()).toEqual('The browse imagery links will become available once the order has finished processing.')
    })
  })

  describe('when panel is provided granule links', () => {
    test('renders a TextWindowActions component', () => {
      const enzymeWrapper = shallow(
        <BrowseLinksPanel
          accessMethodType="download"
          earthdataEnvironment="prod"
          browseUrls={['http://search.earthdata.nasa.gov', 'http://cmr.earthdata.nasa.gov']}
          retrievalId="1"
          granuleCount={10}
          granuleLinksIsLoading
          percentDoneDownloadLinks="25"
        />
      )

      expect(enzymeWrapper.find('.order-status-item__tab-intro').text()).toEqual('Retrieving files for 10 granules...')
      expect(enzymeWrapper.find(ProgressBar).props().now).toEqual('25')
      expect(enzymeWrapper.find(ProgressBar).props().label).toEqual('25%')

      const windowActions = enzymeWrapper.find(TextWindowActions)
      expect(windowActions.props().id).toEqual('links-1')
      expect(windowActions.props().fileContents).toEqual('http://search.earthdata.nasa.gov\nhttp://cmr.earthdata.nasa.gov')
      expect(windowActions.props().fileName).toEqual('1-download-browse-imagery.txt')
      expect(windowActions.props().clipboardContents).toEqual('http://search.earthdata.nasa.gov\nhttp://cmr.earthdata.nasa.gov')
      expect(windowActions.props().modalTitle).toEqual('Browse Imagery Links')
    })
  })

  describe('when the text window actions are disabled', () => {
    test('hides the copy and save buttons', () => {
      const enzymeWrapper = shallow(
        <BrowseLinksPanel
          accessMethodType="ESI"
          earthdataEnvironment="prod"
          browseUrls={['http://search.earthdata.nasa.gov', 'http://cmr.earthdata.nasa.gov']}
          retrievalId="1"
          granuleCount={10}
          granuleLinksIsLoading
          showTextWindowActions={false}
        />
      )

      const windowActions = enzymeWrapper.find(TextWindowActions)
      expect(windowActions.props().disableCopy).toEqual(true)
      expect(windowActions.props().disableSave).toEqual(true)
    })
  })
})
