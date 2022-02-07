import React from 'react'
import ReactDOM from 'react-dom'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Dropdown } from 'react-bootstrap'

import * as addToast from '../../../util/addToast'
import { GranuleResultsDataLinksButton, CustomDataLinksToggle } from '../GranuleResultsDataLinksButton'
import Button from '../../Button/Button'
import CopyableText from '../../CopyableText/CopyableText'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collectionId: 'TEST_ID',
    directDistributionInformation: {},
    dataLinks: [
      {
        rel: 'http://linkrel/data#',
        title: 'linktitle',
        href: 'http://linkhref'
      }
    ],
    s3Links: [],
    onMetricsDataAccess: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleResultsDataLinksButton {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()

  Object.assign(navigator, {
    clipboard: {}
  })
})

describe('GranuleResultsDataLinksButton component', () => {
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

    test('prevents default when clicked', () => {
      const preventDefaultMock = jest.fn()
      const { enzymeWrapper } = setup({
        dataLinks: []
      })

      enzymeWrapper.find(Button).simulate('click', { preventDefault: preventDefaultMock })
      expect(preventDefaultMock).toHaveBeenCalledTimes(1)
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
      // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
      ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

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

    describe('when the dropdown is clicked', () => {
      test('stops event propagation', () => {
        const stopPropagationMock = jest.fn()
        // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
        ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

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
        enzymeWrapper.simulate('click', { stopPropagation: stopPropagationMock })
        expect(stopPropagationMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('when a link is clicked', () => {
      test('stops propagation of events', () => {
        const stopPropagationMock = jest.fn()
        // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
        ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

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

        const dataLinks = enzymeWrapper.find('.granule-results-data-links-button__dropdown-item')

        dataLinks.at(0).simulate('click', { stopPropagation: stopPropagationMock })
        expect(stopPropagationMock).toHaveBeenCalledTimes(1)
      })

      test('calls the metrics event', () => {
        // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
        ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

        const { enzymeWrapper, props } = setup({
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

        const dataLinks = enzymeWrapper.find('.granule-results-data-links-button__dropdown-item')

        dataLinks.at(0).simulate('click', { stopPropagation: () => {} })
        expect(props.onMetricsDataAccess).toHaveBeenCalledTimes(1)
        expect(props.onMetricsDataAccess).toHaveBeenCalledWith({
          collections: [{
            collectionId: 'TEST_ID'
          }],
          type: 'single_granule_download'
        })
      })

      test('displays a success toast', () => {
        // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
        ReactDOM.createPortal = jest.fn((dropdown) => dropdown)
        const addToastMock = jest.spyOn(addToast, 'addToast')

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

        const dataLinks = enzymeWrapper.find('.granule-results-data-links-button__dropdown-item')

        dataLinks.at(0).simulate('click', { stopPropagation: () => {} })

        expect(addToastMock.mock.calls.length).toBe(1)
        expect(addToastMock.mock.calls[0][0]).toEqual('Initiated download of file: linkhref')
        expect(addToastMock.mock.calls[0][1].appearance).toEqual('success')
        expect(addToastMock.mock.calls[0][1].autoDismiss).toEqual(true)
      })
    })
  })

  describe('when s3 links are provided', () => {
    test('renders the correct element', () => {
      // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
      ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

      const { enzymeWrapper } = setup({
        s3Links: [
          {
            rel: 'http://linkrel/s3#',
            title: 'linktitle',
            href: 's3://linkhref'
          }, {
            rel: 'http://linkrel2/s3#',
            title: 'linktitle2',
            href: 's3://linkhref2'
          }
        ]
      })
      expect(enzymeWrapper.type()).toBe(Dropdown)
    })

    test('renders s3 links as buttons', () => {
      // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
      ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

      const { enzymeWrapper } = setup({
        dataLinks: [],
        directDistributionInformation: {
          region: 'aws-region'
        },
        s3Links: [
          {
            rel: 'http://linkrel/s3#',
            title: 'linktitle',
            href: 's3://linkhref'
          }, {
            rel: 'http://linkrel2/s3#',
            title: 'linktitle2',
            href: 's3://linkhref2'
          }
        ]
      })

      expect(enzymeWrapper.find(Dropdown.Item).at(0).type()).toBe(Dropdown.Item)
      expect(enzymeWrapper.find(Dropdown.Item).at(0).props().label).toBe('Copy AWS S3 path to clipboard')
      expect(enzymeWrapper.find(Dropdown.Item).at(0).props().text).toEqual('linkhref')
    })

    describe('when clicking an s3 link', () => {
      test('calls the metrics event', async () => {
        // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
        ReactDOM.createPortal = jest.fn((dropdown) => dropdown)
        const { enzymeWrapper, props } = setup({
          dataLinks: [],
          directDistributionInformation: {
            region: 'aws-region'
          },
          s3Links: [
            {
              rel: 'http://linkrel/s3#',
              title: 'linktitle',
              href: 's3://linkhref'
            }, {
              rel: 'http://linkrel2/s3#',
              title: 'linktitle2',
              href: 's3://linkhref2'
            }
          ]
        })
        enzymeWrapper.find(Dropdown.Item).at(0).props().onClick()

        expect(props.onMetricsDataAccess).toHaveBeenCalledTimes(1)
        expect(props.onMetricsDataAccess).toHaveBeenCalledWith({
          collections: [{
            collectionId: 'TEST_ID'
          }],
          type: 'single_granule_s3_access'
        })
      })
    })

    describe('when direct distribution information is provided', () => {
      test('displays the region as a button', () => {
        ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

        const { enzymeWrapper } = setup({
          dataLinks: [],
          directDistributionInformation: {
            region: 'aws-region'
          },
          s3Links: [
            {
              rel: 'http://linkrel/s3#',
              title: 'linktitle',
              href: 's3://linkhref'
            }, {
              rel: 'http://linkrel2/s3#',
              title: 'linktitle2',
              href: 's3://linkhref2'
            }
          ]
        })
        const distributionInformation = enzymeWrapper.find('.tab-content').children()
        expect(distributionInformation.find(CopyableText).at(0).props().text).toBe('aws-region')
      })

      test('displays the s3 bucket and object prefix as a button', () => {
        ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

        const { enzymeWrapper } = setup({
          dataLinks: [],
          directDistributionInformation: {
            region: 'aws-region',
            s3BucketAndObjectPrefixNames: ['TestBucketOrObjectPrefix'],
            s3CredentialsApiEndpoint: 'https://DAACCredentialEndpoint.org',
            s3CredentialsApiDocumentationUrl: 'https://DAACCredentialDocumentation.org'
          },
          s3Links: [
            {
              rel: 'http://linkrel/s3#',
              title: 'linktitle',
              href: 's3://linkhref'
            }, {
              rel: 'http://linkrel2/s3#',
              title: 'linktitle2',
              href: 's3://linkhref2'
            }
          ]
        })
        const distributionInformation = enzymeWrapper.find('.tab-content').children()
        expect(distributionInformation.find(CopyableText).at(1).props().text).toBe('TestBucketOrObjectPrefix')
      })

      describe('when multiple bucket object prefixes are provided', () => {
        test('displays the s3 bucket and object prefixes as buttons', () => {
          ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

          const { enzymeWrapper } = setup({
            dataLinks: [],
            directDistributionInformation: {
              region: 'aws-region',
              s3BucketAndObjectPrefixNames: [
                'TestBucketOrObjectPrefix',
                'TestBucketOrObjectPrefixTwo'
              ],
              s3CredentialsApiEndpoint: 'https://DAACCredentialEndpoint.org',
              s3CredentialsApiDocumentationUrl: 'https://DAACCredentialDocumentation.org'
            },
            s3Links: [
              {
                rel: 'http://linkrel/s3#',
                title: 'linktitle',
                href: 's3://linkhref'
              }, {
                rel: 'http://linkrel2/s3#',
                title: 'linktitle2',
                href: 's3://linkhref2'
              }
            ]
          })
          const distributionInformation = enzymeWrapper.find('.tab-content').children()
          expect(distributionInformation.find(CopyableText).at(1).props().text).toBe('TestBucketOrObjectPrefix')
          expect(distributionInformation.find(CopyableText).at(2).props().text).toBe('TestBucketOrObjectPrefixTwo')
        })
      })
    })
  })
})

describe('CustomDataLinksToggle component', () => {
  test('calls expected event methods on download click', () => {
    const mockClickEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn()
    }

    const mockClickCallback = jest.fn()

    shallow(<CustomDataLinksToggle onClick={mockClickCallback} />)
      .simulate('click', mockClickEvent)

    expect(mockClickEvent.stopPropagation).toHaveBeenCalled()
    expect(mockClickEvent.preventDefault).toHaveBeenCalled()
    expect(mockClickCallback).toHaveBeenCalled()
  })
})
