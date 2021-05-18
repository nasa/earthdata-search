import React from 'react'
import ReactDOM from 'react-dom'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Dropdown } from 'react-bootstrap'

import * as addToast from '../../../util/addToast'
import { GranuleResultsDataLinksButton, CustomDataLinksToggle } from '../GranuleResultsDataLinksButton'
import Button from '../../Button/Button'

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
      ReactDOM.createPortal = jest.fn(dropdown => dropdown)

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
        ReactDOM.createPortal = jest.fn(dropdown => dropdown)

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
        ReactDOM.createPortal = jest.fn(dropdown => dropdown)

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
        ReactDOM.createPortal = jest.fn(dropdown => dropdown)

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
        ReactDOM.createPortal = jest.fn(dropdown => dropdown)
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
      ReactDOM.createPortal = jest.fn(dropdown => dropdown)

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
      ReactDOM.createPortal = jest.fn(dropdown => dropdown)

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

      const tabDropdownItems = enzymeWrapper.find('.tab-content').props().children.props.children[1]
      expect(tabDropdownItems[0].type.displayName).toBe('DropdownItem')
      expect(tabDropdownItems[0].props.label).toBe('Copy path to file in AWS S3')
      expect(tabDropdownItems[0].props.children[0]).toBe('linkhref')
    })

    describe('when clicking an s3 link', () => {
      test('stops event propagation', () => {
        // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
        ReactDOM.createPortal = jest.fn(dropdown => dropdown)
        const stopPropagationMock = jest.fn()

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
        const tabDropdownItems = enzymeWrapper.find('.tab-content').props().children.props.children[1]
        tabDropdownItems[0].props.onClick({ stopPropagation: stopPropagationMock })
        expect(stopPropagationMock).toHaveBeenCalledTimes(1)
      })

      test('calls the metrics event', async () => {
        // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
        ReactDOM.createPortal = jest.fn(dropdown => dropdown)
        const stopPropagationMock = jest.fn()

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
        const tabDropdownItems = enzymeWrapper.find('.tab-content').props().children.props.children[1]
        tabDropdownItems[0].props.onClick({ stopPropagation: stopPropagationMock })
        expect(props.onMetricsDataAccess).toHaveBeenCalledTimes(1)
        expect(props.onMetricsDataAccess).toHaveBeenCalledWith({
          collections: [{
            collectionId: 'TEST_ID'
          }],
          type: 'single_granule_s3_access'
        })
      })

      describe('when navigation.clipboard.writeText is not defined', () => {
        test('displays a toast', async () => {
          // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
          ReactDOM.createPortal = jest.fn(dropdown => dropdown)
          const stopPropagationMock = jest.fn()
          const addToastMock = jest.spyOn(addToast, 'addToast')

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
          const tabDropdownItems = enzymeWrapper.find('.tab-content').props().children.props.children[1]

          tabDropdownItems[0].props.onClick({ stopPropagation: stopPropagationMock })

          expect(addToastMock.mock.calls.length).toBe(1)
          expect(addToastMock.mock.calls[0][0]).toEqual('Failed to copy AWS S3 path for: linkhref')
          expect(addToastMock.mock.calls[0][1].appearance).toEqual('error')
          expect(addToastMock.mock.calls[0][1].autoDismiss).toEqual(true)
        })
      })
    })

    describe('when navigation.clipboard.writeText is defined', () => {
      test('copies the s3 link', async () => {
        // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
        ReactDOM.createPortal = jest.fn(dropdown => dropdown)
        const stopPropagationMock = jest.fn()

        Object.assign(navigator, {
          clipboard: {
            writeText: () => {}
          }
        })

        jest.spyOn(navigator.clipboard, 'writeText')

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
        const tabDropdownItems = enzymeWrapper.find('.tab-content').props().children.props.children[1]
        await tabDropdownItems[0].props.onClick({ stopPropagation: stopPropagationMock })

        expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('s3://linkhref')
      })

      test('displays a toast', async () => {
        // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
        ReactDOM.createPortal = jest.fn(dropdown => dropdown)
        const stopPropagationMock = jest.fn()
        const addToastMock = jest.spyOn(addToast, 'addToast')

        Object.assign(navigator, {
          clipboard: {
            writeText: () => {}
          }
        })

        jest.spyOn(navigator.clipboard, 'writeText')

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
        const tabDropdownItems = enzymeWrapper.find('.tab-content').props().children.props.children[1]
        await tabDropdownItems[0].props.onClick({ stopPropagation: stopPropagationMock })

        expect(addToastMock.mock.calls.length).toBe(1)
        expect(addToastMock.mock.calls[0][0]).toEqual('Copied AWS S3 path for: linkhref')
        expect(addToastMock.mock.calls[0][1].appearance).toEqual('success')
        expect(addToastMock.mock.calls[0][1].autoDismiss).toEqual(true)
      })
    })

    describe('when direct distribution information is provided', () => {
      test('displays the region as a button', () => {
        ReactDOM.createPortal = jest.fn(dropdown => dropdown)

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
        const distributionInformation = enzymeWrapper.find('.tab-content').props().children.props.children[0]
        const regionRow = distributionInformation.props.children[0]
        const value = regionRow.props.children[1]
        expect(value.props.children).toBe('aws-region')
      })

      describe('when clicking the region', () => {
        describe('when navigation.clipboard.writeText is not defined', () => {
          test('displays a toast', async () => {
            // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
            ReactDOM.createPortal = jest.fn(dropdown => dropdown)
            const addToastMock = jest.spyOn(addToast, 'addToast')

            Object.assign(navigator, {
              clipboard: {}
            })

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
            const distributionInformation = enzymeWrapper.find('.tab-content').props().children.props.children[0]
            const regionRow = distributionInformation.props.children[0]
            const value = regionRow.props.children[1]
            await value.props.onClick()

            expect(addToastMock.mock.calls.length).toBe(1)
            expect(addToastMock.mock.calls[0][0]).toEqual('Failed to copy the AWS S3 Region')
            expect(addToastMock.mock.calls[0][1].appearance).toEqual('error')
            expect(addToastMock.mock.calls[0][1].autoDismiss).toEqual(true)
          })
        })

        describe('when navigation.clipboard.writeText is not defined', () => {
          test('displays a toast', async () => {
            // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
            ReactDOM.createPortal = jest.fn(dropdown => dropdown)
            const addToastMock = jest.spyOn(addToast, 'addToast')

            Object.assign(navigator, {
              clipboard: {
                writeText: jest.fn()
              }
            })

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
            const distributionInformation = enzymeWrapper.find('.tab-content').props().children.props.children[0]
            const regionRow = distributionInformation.props.children[0]
            const value = regionRow.props.children[1]
            await value.props.onClick()

            expect(addToastMock.mock.calls.length).toBe(1)
            expect(addToastMock.mock.calls[0][0]).toEqual('Copied the AWS S3 Region')
            expect(addToastMock.mock.calls[0][1].appearance).toEqual('success')
            expect(addToastMock.mock.calls[0][1].autoDismiss).toEqual(true)
          })
        })
      })

      test('displays the s3 bucket and object prefix as a button', () => {
        ReactDOM.createPortal = jest.fn(dropdown => dropdown)

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
        const distributionInformation = enzymeWrapper.find('.tab-content').props().children.props.children[0]
        const bucketObjectPrefixRow = distributionInformation.props.children[1]
        const value = bucketObjectPrefixRow.props.children[1][0]
        const bucketObjectPrefixButton = value.props.children[0]
        expect(bucketObjectPrefixButton.props.children).toBe('TestBucketOrObjectPrefix')
      })

      describe('when clicking the bucket object prefix button', () => {
        describe('when navigation.clipboard.writeText is not defined', () => {
          test('displays a toast', async () => {
            // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
            ReactDOM.createPortal = jest.fn(dropdown => dropdown)
            const addToastMock = jest.spyOn(addToast, 'addToast')

            Object.assign(navigator, {
              clipboard: {}
            })

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
            const distributionInformation = enzymeWrapper.find('.tab-content').props().children.props.children[0]
            const bucketObjectPrefixRow = distributionInformation.props.children[1]
            const value = bucketObjectPrefixRow.props.children[1][0]
            const bucketObjectPrefixButton = value.props.children[0]
            await bucketObjectPrefixButton.props.onClick()

            expect(addToastMock.mock.calls.length).toBe(1)
            expect(addToastMock.mock.calls[0][0]).toEqual('Failed to copy the AWS S3 Bucket/Object Prefix')
            expect(addToastMock.mock.calls[0][1].appearance).toEqual('error')
            expect(addToastMock.mock.calls[0][1].autoDismiss).toEqual(true)
          })
        })

        describe('when navigation.clipboard.writeText is not defined', () => {
          test('displays a toast', async () => {
            // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
            ReactDOM.createPortal = jest.fn(dropdown => dropdown)
            const addToastMock = jest.spyOn(addToast, 'addToast')

            Object.assign(navigator, {
              clipboard: {
                writeText: jest.fn()
              }
            })

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
            const distributionInformation = enzymeWrapper.find('.tab-content').props().children.props.children[0]
            const bucketObjectPrefixRow = distributionInformation.props.children[1]
            const value = bucketObjectPrefixRow.props.children[1][0]
            const bucketObjectPrefixButton = value.props.children[0]
            await bucketObjectPrefixButton.props.onClick()

            expect(addToastMock.mock.calls.length).toBe(1)
            expect(addToastMock.mock.calls[0][0]).toEqual('Copied the AWS S3 Bucket/Object Prefix')
            expect(addToastMock.mock.calls[0][1].appearance).toEqual('success')
            expect(addToastMock.mock.calls[0][1].autoDismiss).toEqual(true)
          })
        })
      })

      describe('when multiple bucket object prefixes are provided', () => {
        test('displays the s3 bucket and object prefixes as buttons', () => {
          ReactDOM.createPortal = jest.fn(dropdown => dropdown)

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
          const distributionInformation = enzymeWrapper.find('.tab-content').props().children.props.children[0]
          const bucketObjectPrefixRow = distributionInformation.props.children[1]
          const bucketObjectPrefixButtonOne = bucketObjectPrefixRow.props.children[1][0]
          const bucketObjectPrefixButtonTwo = bucketObjectPrefixRow.props.children[1][1]
          expect(bucketObjectPrefixButtonOne.props.children[0].props.children).toBe('TestBucketOrObjectPrefix')
          expect(bucketObjectPrefixButtonTwo.props.children[0].props.children).toBe('TestBucketOrObjectPrefixTwo')
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
