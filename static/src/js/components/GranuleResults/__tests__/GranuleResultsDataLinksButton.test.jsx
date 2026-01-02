import ReactDOM from 'react-dom'
import {
  createEvent,
  fireEvent,
  screen,
  waitFor
} from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import {
  GranuleResultsDataLinksButton,
  CustomDataLinksToggle
} from '../GranuleResultsDataLinksButton'

import addToast from '../../../util/addToast'
import { metricsDataAccess } from '../../../util/metrics/metricsDataAccess'

jest.mock('../../../util/metrics/metricsDataAccess', () => ({
  metricsDataAccess: jest.fn()
}))

jest.mock('../../../util/addToast', () => ({
  __esModule: true,
  default: jest.fn()
}))

const setup = setupTest({
  Component: GranuleResultsDataLinksButton,
  defaultProps: {
    collectionId: 'TEST_ID',
    directDistributionInformation: {},
    dataLinks: [
      {
        rel: 'http://linkrel/data#',
        title: 'linktitle',
        href: 'http://linkhref'
      }
    ],
    id: 'G123456789-TEST',
    s3Links: []
  }
})

const setupCustomDataLinksToggle = setupTest({
  Component: CustomDataLinksToggle,
  defaultProps: {
    id: 'G-123456789',
    onClick: jest.fn()
  }
})

describe('GranuleResultsDataLinksButton component', () => {
  describe('with no granule links', () => {
    test('renders a disabled download button', () => {
      setup({
        overrideProps: {
          dataLinks: []
        }
      })

      expect(screen.getByRole('button')).toBeDisabled()
    })

    test('prevents default when clicked', () => {
      const stopPropagationMock = jest.fn()

      setup()

      const button = screen.getByRole('button')

      const clickEvent = createEvent.click(button)
      clickEvent.stopPropagation = stopPropagationMock

      fireEvent(button, clickEvent)

      expect(stopPropagationMock).toHaveBeenCalledTimes(1)
      expect(stopPropagationMock).toHaveBeenCalledWith()
    })
  })

  describe('with a single granule link', () => {
    test('calls callback with the correct data on click', async () => {
      const { user } = setup()

      const button = screen.getByRole('button')
      await user.click(button)

      expect(metricsDataAccess).toHaveBeenCalledTimes(1)
      expect(metricsDataAccess).toHaveBeenCalledWith({
        collections: [
          { collectionId: 'TEST_ID' }
        ],
        type: 'single_granule_download'
      })
    })

    test('has a tooltip', async () => {
      ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

      const { user } = setup()

      const button = screen.getByRole('button')
      await user.hover(button)

      expect(await screen.findByRole('tooltip')).toHaveTextContent('Download granule data')
    })
  })

  describe('with multiple granule links', () => {
    test('renders the correct element', async () => {
      // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
      ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

      const { user } = setup({
        overrideProps: {
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
        }
      })

      const button = screen.getByRole('button')
      await user.click(button)

      expect(screen.getByRole('link', { name: 'linkhref' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'linkhref2' })).toBeInTheDocument()
    })

    describe('when the dropdown is clicked', () => {
      test('stops event propagation', async () => {
        const stopPropagationMock = jest.fn()
        // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
        ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

        setup({
          overrideProps: {
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
          }
        })

        const button = screen.getByRole('button')

        const clickEvent = createEvent.click(button)
        clickEvent.stopPropagation = stopPropagationMock

        fireEvent(button, clickEvent)

        await waitFor(() => {
          expect(stopPropagationMock).toHaveBeenCalledTimes(1)
        })

        expect(stopPropagationMock).toHaveBeenCalledWith()
      })
    })

    describe('when a link is clicked', () => {
      test('calls the metrics event and displays a success toast', async () => {
        // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
        ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

        const { user } = setup({
          overrideProps: {
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
          }
        })

        const button = screen.getByRole('button')
        await user.click(button)

        const link = screen.getByRole('link', { name: 'linkhref' })
        await user.click(link)

        expect(metricsDataAccess).toHaveBeenCalledTimes(1)
        expect(metricsDataAccess).toHaveBeenCalledWith({
          collections: [{
            collectionId: 'TEST_ID'
          }],
          type: 'single_granule_download'
        })

        expect(addToast).toHaveBeenCalledTimes(1)
        expect(addToast).toHaveBeenCalledWith('Initiated download of file: linkhref', {
          appearance: 'success',
          autoDismiss: true
        })
      })
    })
  })

  describe('when s3 links are provided', () => {
    test('renders s3 links as buttons', async () => {
      // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
      ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

      const { user } = setup({
        overrideProps: {
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
        }
      })

      const button = screen.getByRole('button')
      await user.click(button)

      expect(screen.getAllByRole('button', { name: 'Copy AWS S3 path to clipboard' }).at(0)).toHaveTextContent('linkhref')
      expect(screen.getAllByRole('button', { name: 'Copy AWS S3 path to clipboard' }).at(1)).toHaveTextContent('linkhref2')
    })

    describe('when clicking an s3 link', () => {
      test('calls the metrics event', async () => {
        // Mocks createPortal method of ReactDOM (https://stackoverflow.com/a/60953708/8116576)
        ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

        const { user } = setup({
          overrideProps: {
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
          }
        })

        const button = screen.getByRole('button')
        await user.click(button)

        const link = screen.getAllByRole('button', { name: 'Copy AWS S3 path to clipboard' }).at(0)
        await user.click(link)

        expect(metricsDataAccess).toHaveBeenCalledTimes(1)
        expect(metricsDataAccess).toHaveBeenCalledWith({
          collections: [{
            collectionId: 'TEST_ID'
          }],
          type: 'single_granule_s3_access'
        })
      })
    })

    describe('when direct distribution information is provided', () => {
      test('displays the region as a button', async () => {
        ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

        const { user } = setup({
          overrideProps: {
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
          }
        })

        const button = screen.getByRole('button')
        await user.click(button)

        expect(screen.getByRole('button', { name: 'Copy region to clipboard' })).toHaveTextContent('aws-region')
      })

      test('displays the s3 bucket and object prefix as a button', async () => {
        ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

        const { user } = setup({
          overrideProps: {
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
          }
        })

        const button = screen.getByRole('button')
        await user.click(button)

        expect(screen.getByRole('button', { name: 'Copy bucket/object prefix to clipboard' })).toHaveTextContent('TestBucketOrObjectPrefix')
      })

      describe('when multiple bucket object prefixes are provided', () => {
        test('displays the s3 bucket and object prefixes as buttons', async () => {
          ReactDOM.createPortal = jest.fn((dropdown) => dropdown)

          const { user } = setup({
            overrideProps: {
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
            }
          })

          const button = screen.getByRole('button')
          await user.click(button)

          expect(screen.getAllByRole('button', { name: 'Copy bucket/object prefix to clipboard' }).at(0)).toHaveTextContent('TestBucketOrObjectPrefix')
          expect(screen.getAllByRole('button', { name: 'Copy bucket/object prefix to clipboard' }).at(1)).toHaveTextContent('TestBucketOrObjectPrefixTwo')
        })
      })
    })
  })
})

describe('CustomDataLinksToggle component', () => {
  test('calls expected event methods on download click', async () => {
    const { props, user } = setupCustomDataLinksToggle()

    const button = screen.getByRole('button')
    await user.click(button)

    expect(props.onClick).toHaveBeenCalledTimes(1)
    expect(props.onClick).toHaveBeenCalledWith(expect.objectContaining({
      type: 'click'
    }))
  })
})
