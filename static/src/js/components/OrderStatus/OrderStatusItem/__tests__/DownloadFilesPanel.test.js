import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { ProgressBar } from 'react-bootstrap'

import { DownloadFilesPanel } from '../DownloadFilesPanel'
import { TextWindowActions } from '../../../TextWindowActions/TextWindowActions'

jest.useFakeTimers('legacy')

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

describe('DownloadFilesPanel', () => {
  describe('when panel is not provided granule links', () => {
    test('renders placeholder message', () => {
      const enzymeWrapper = shallow(
        <DownloadFilesPanel
          accessMethodType="download"
          earthdataEnvironment="prod"
          downloadLinks={[]}
          retrievalId="1"
          granuleCount={100}
          granuleLinksIsLoading={false}
        />
      )

      expect(enzymeWrapper.hasClass('order-status-item__tab-intro')).toEqual(true)
      expect(enzymeWrapper.find('.order-status-item__tab-intro').text()).toEqual('The download files will become available once the order has finished processing')
    })
  })

  describe('when panel is provided granule links', () => {
    test('renders a TextWindowActions component', () => {
      const enzymeWrapper = shallow(
        <DownloadFilesPanel
          accessMethodType="download"
          earthdataEnvironment="prod"
          downloadLinks={['http://search.earthdata.nasa.gov', 'http://cmr.earthdata.nasa.gov']}
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
      expect(windowActions.props().fileName).toEqual('1-download.txt')
      expect(windowActions.props().clipboardContents).toEqual('http://search.earthdata.nasa.gov\nhttp://cmr.earthdata.nasa.gov')
      expect(windowActions.props().modalTitle).toEqual('Download Files')
    })
  })

  describe('when the text window actions are disabled', () => {
    test('hides the copy and save buttons', () => {
      const enzymeWrapper = shallow(
        <DownloadFilesPanel
          accessMethodType="ESI"
          earthdataEnvironment="prod"
          downloadLinks={['http://search.earthdata.nasa.gov', 'http://cmr.earthdata.nasa.gov']}
          retrievalCollection={{}}
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
