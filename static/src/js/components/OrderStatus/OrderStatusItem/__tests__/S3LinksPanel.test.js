import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { S3LinksPanel } from '../S3LinksPanel'
import { TextWindowActions } from '../../../TextWindowActions/TextWindowActions'

jest.useFakeTimers('legacy')

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

describe('S3LinksPanel', () => {
  describe('when panel is not provided s3 links', () => {
    test('renders placeholder message', () => {
      const enzymeWrapper = shallow(
        <S3LinksPanel
          accessMethodType="download"
          s3Links={[]}
          retrievalId="1"
          granuleCount={100}
          granuleLinksIsLoading={false}
          directDistributionInformation={{
            region: 'aws-region'
          }}
        />
      )

      expect(enzymeWrapper.hasClass('order-status-item__tab-intro')).toEqual(true)
      expect(enzymeWrapper.find('.order-status-item__tab-intro').text()).toEqual('The AWS S3 objects will become available once the order has finished processing')
    })
  })

  describe('when panel is provided granule links', () => {
    test('renders a TextWindowActions component', () => {
      const enzymeWrapper = shallow(
        <S3LinksPanel
          accessMethodType="download"
          s3Links={['s3://search.earthdata.nasa.gov', 's3://cmr.earthdata.nasa.gov']}
          retrievalId="1"
          granuleCount={100}
          granuleLinksIsLoading={false}
          directDistributionInformation={{
            region: 'aws-region'
          }}
        />
      )

      expect(enzymeWrapper.find('.order-status-item__tab-intro').text()).toContain('Direct cloud access for this collection is available in the aws-region region in AWS S3.')
      expect(enzymeWrapper.find('.order-status-item__tab-intro').text()).toContain('Retrieved 2 objects for 100 granule')


      const windowActions = enzymeWrapper.find(TextWindowActions)
      expect(windowActions.props().id).toEqual('links-1')
      expect(windowActions.props().fileContents).toEqual('s3://search.earthdata.nasa.gov\ns3://cmr.earthdata.nasa.gov')
      expect(windowActions.props().fileName).toEqual('1-download-s3.txt')
      expect(windowActions.props().clipboardContents).toEqual('s3://search.earthdata.nasa.gov\ns3://cmr.earthdata.nasa.gov')
      expect(windowActions.props().modalTitle).toEqual('AWS S3 Access')
    })
  })
})

