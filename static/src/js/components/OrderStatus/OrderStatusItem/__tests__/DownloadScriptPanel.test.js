import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import * as generateDownloadScript from '../../../../util/files/generateDownloadScript'

import { DownloadScriptPanel } from '../DownloadScriptPanel'
import { TextWindowActions } from '../../../TextWindowActions/TextWindowActions'

jest.useFakeTimers('legacy')

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

describe('DownloadScriptPanel', () => {
  describe('when panel is not provided granule links', () => {
    test('renders placeholder message', () => {
      const enzymeWrapper = shallow(
        <DownloadScriptPanel
          accessMethodType="download"
          earthdataEnvironment="prod"
          downloadLinks={[]}
          retrievalCollection={{}}
          retrievalId="1"
          granuleCount={100}
          granuleLinksIsLoading={false}
        />
      )

      expect(enzymeWrapper.hasClass('order-status-item__tab-intro')).toEqual(true)
      expect(enzymeWrapper.find('.order-status-item__tab-intro').text()).toEqual('The download script will become available once the order has finished processing')
    })
  })

  describe('when panel is provided granule links', () => {
    test('renders a TextWindowActions component', () => {
      const generateDownloadScriptMock = jest.spyOn(generateDownloadScript, 'generateDownloadScript')

      const enzymeWrapper = shallow(
        <DownloadScriptPanel
          accessMethodType="download"
          earthdataEnvironment="prod"
          downloadLinks={['http://search.earthdata.nasa.gov', 'http://cmr.earthdata.nasa.gov']}
          retrievalCollection={{}}
          retrievalId="1"
          granuleCount={10}
          granuleLinksIsLoading
        />
      )

      expect(enzymeWrapper.find('.order-status-item__status-text').text()).toEqual('Retrieving files for 10 granules...')

      const windowActions = enzymeWrapper.find(TextWindowActions)
      expect(windowActions.props().id).toEqual('script-1')
      expect(windowActions.props().fileName).toEqual('1-download.sh')
      expect(windowActions.props().modalTitle).toEqual('Download Script')

      expect(generateDownloadScriptMock).toHaveBeenCalledWith(
        ['http://search.earthdata.nasa.gov', 'http://cmr.earthdata.nasa.gov'],
        {},
        'prod'
      )
    })
  })
})
