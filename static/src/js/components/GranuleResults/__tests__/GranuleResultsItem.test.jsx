import React from 'react'
import ReactDOM from 'react-dom'

import { screen, waitFor } from '@testing-library/react'
import Highlighter from 'react-highlight-words'

import setupTest from '../../../../../../jestConfigs/setupTest'

import GranuleResultsItem from '../GranuleResultsItem'
import * as getSearchWords from '../../../util/getSearchWords'

import EDSCImage from '../../EDSCImage/EDSCImage'

jest.mock('../../../containers/PortalFeatureContainer/PortalFeatureContainer', () => {
  const mockPortalFeatureContainer = jest.fn(({ children }) => (
    <mock-mockPortalFeatureContainer data-testid="mockPortalFeatureContainer">
      {children}
    </mock-mockPortalFeatureContainer>
  ))

  return mockPortalFeatureContainer
})

jest.mock('react-highlight-words', () => jest.fn(
  ({ textToHighlight }) => <span><span>{textToHighlight}</span></span>
))

jest.mock('../../EDSCImage/EDSCImage', () => jest.fn(
  ({ className }) => <div className={className} alt="Browse Image for " data-testid="mock-edsc-image"><img alt="Mocked Browse" /></div>
))

const defaultProps = {
  browseUrl: undefined,
  collectionId: 'collectionId',
  collectionQuerySpatial: {},
  collectionTags: {},
  directDistributionInformation: {},
  focusedGranule: '',
  isCollectionInProject: false,
  isGranuleInProject: jest.fn(() => false),
  isFocused: false,
  isLast: false,
  isProjectGranulesLoading: false,
  location: { search: 'location' },
  onAddGranuleToProjectCollection: jest.fn(),
  onExcludeGranule: jest.fn(),
  onMetricsDataAccess: jest.fn(),
  onMetricsAddGranuleProject: jest.fn(),
  onRemoveGranuleFromProjectCollection: jest.fn(),
  readableGranuleName: ['']
}

const cmrProps = {
  ...defaultProps,
  granule: {
    id: 'granuleId',
    browseFlag: true,
    onlineAccessFlag: true,
    formattedTemporal: [
      '2019-04-28 00:00:00',
      '2019-04-29 23:59:59'
    ],
    timeStart: '2019-04-28 00:00:00',
    timeEnd: '2019-04-29 23:59:59',
    granuleThumbnail: '/fake/path/image.jpg',
    title: 'Granule title',
    dataLinks: [
      {
        rel: 'http://linkrel/data#',
        title: 'linktitle',
        href: 'http://linkhref'
      }
    ],
    s3Links: []
  }
}
const cmrS3Props = {
  ...defaultProps,
  directDistributionInformation: {
    region: 's3-region',
    s3CredentialsApiEndpoint: 'http://example.com/creds',
    s3CredentialsApiDocumentationUrl: 'http://example.com/docs'
  },
  granule: {
    id: 'granuleId',
    browseFlag: true,
    onlineAccessFlag: true,
    formattedTemporal: [
      '2019-04-28 00:00:00',
      '2019-04-29 23:59:59'
    ],
    timeStart: '2019-04-28 00:00:00',
    timeEnd: '2019-04-29 23:59:59',
    granuleThumbnail: '/fake/path/image.jpg',
    title: 'Granule title',
    dataLinks: [
      {
        rel: 'http://linkrel/data#',
        title: 'linktitle',
        href: 'http://linkhref'
      }
    ],
    s3Links: [
      {
        rel: 'http://linkrel/s3#',
        title: 'linktitle',
        href: 's3://linkhref'
      }
    ]
  }
}

const cmrNoDownloadProps = {
  ...defaultProps,
  granule: {
    id: 'granuleId',
    browseFlag: true,
    onlineAccessFlag: false,
    formattedTemporal: [
      '2019-04-28 00:00:00',
      '2019-04-29 23:59:59'
    ],
    timeStart: '2019-04-28 00:00:00',
    timeEnd: '2019-04-29 23:59:59',
    granuleThumbnail: '/fake/path/image.jpg',
    title: 'Granule title',
    dataLinks: [
      {
        rel: 'http://linkrel/data#',
        title: 'linktitle',
        href: 's3://bucket/filename'
      }
    ],
    s3Links: []
  }
}

const focusedGranuleProps = {
  ...defaultProps,
  focusedGranule: 'granuleId',
  granule: {
    id: 'granuleId',
    browseFlag: true,
    formattedTemporal: [
      '2019-04-28 00:00:00',
      '2019-04-29 23:59:59'
    ],
    isFocusedGranule: true,
    isHoveredGranule: false,
    timeStart: '2019-04-28 00:00:00',
    timeEnd: '2019-04-29 23:59:59',
    granuleThumbnail: '/fake/path/image.jpg',
    title: 'Granule title',
    dataLinks: [
      {
        rel: 'http://linkrel',
        title: 'linktitle',
        href: 'http://linkhref'
      }
    ],
    s3Links: []
  }
}

const noThumbProps = {
  ...defaultProps,
  granule: {
    browseFlag: false,
    formattedTemporal: [
      '2019-04-28 00:00:00',
      '2019-04-29 23:59:59'
    ],
    timeStart: '2019-04-28 00:00:00',
    timeEnd: '2019-04-29 23:59:59',
    title: 'Granule title',
    dataLinks: [
      {
        rel: 'http://linkrel/data#',
        title: 'linktitle',
        href: 'http://linkhref'
      }
    ],
    s3Links: []
  }
}

const withBrowseProps = {
  ...defaultProps,
  granule: {
    browseFlag: true,
    browseUrl: 'https://test.com/browse_image',
    formattedTemporal: [
      '2019-04-28 00:00:00',
      '2019-04-29 23:59:59'
    ],
    timeStart: '2019-04-28 00:00:00',
    timeEnd: '2019-04-29 23:59:59',
    title: 'Granule title',
    granuleThumbnail: '/fake/path/image.jpg',
    dataLinks: [
      {
        rel: 'http://linkrel/data#',
        title: 'linktitle',
        href: 'http://linkhref'
      }
    ],
    s3Links: []
  }
}
const opensearchProps = {
  ...defaultProps,
  granule: {
    id: 'granuleId',
    browseFlag: true,
    formattedTemporal: [
      '2019-04-28 00:00:00',
      '2019-04-29 23:59:59'
    ],
    timeStart: '2019-04-28 00:00:00',
    timeEnd: '2019-04-29 23:59:59',
    title: 'Granule title',
    isOpenSearch: true,
    granuleThumbnail: '/fake/path/image.jpg',
    dataLinks: [
      {
        rel: 'http://linkrel/data#',
        title: 'linktitle',
        href: 'http://linkhref'
      }
    ],
    s3Links: []
  }
}

const hasGenerateNotebookTagProps = {
  ...defaultProps,
  collectionQuerySpatial: {},
  collectionTags: {
    'edsc.extra.serverless.notebook_generation': {
      data: {
        variable_concept_id: 'V123456789-TESTPROV'
      }
    }
  },
  granule: {
    id: 'granuleId',
    browseFlag: true,
    onlineAccessFlag: true,
    formattedTemporal: [
      '2019-04-28 00:00:00',
      '2019-04-29 23:59:59'
    ],
    timeStart: '2019-04-28 00:00:00',
    timeEnd: '2019-04-29 23:59:59',
    granuleThumbnail: '/fake/path/image.jpg',
    title: 'Granule title',
    dataLinks: [
      {
        rel: 'http://linkrel/data#',
        title: 'linktitle',
        href: 'http://linkhref'
      }
    ],
    s3Links: []
  }
}

const staticCoverageProps = {
  // `timeStart` and timeEnd are intentionally left out in order to
  // mimic what is passed to GranuleResultsItem when the app is running

  ...defaultProps,
  granule: {
    id: 'granuleId',
    browseFlag: false,
    onlineAccessFlag: false,
    formattedTemporal: [],
    granuleThumbnail: '/fake/path/image.jpg',
    title: 'Granule title',
    dataLinks: [
      {
        rel: 'http://linkrel/data#',
        title: 'linktitle',
        href: 'http://linkhref'
      }
    ],
    s3Links: []
  }
}

const overrideProps = {
  ...defaultProps,
  granule: {
    id: 'granuleId',
    browseFlag: true,
    onlineAccessFlag: true,
    formattedTemporal: [
      '2019-04-28 00:00:00',
      '2019-04-29 23:59:59'
    ],
    timeStart: '2019-04-28 00:00:00',
    timeEnd: '2019-04-29 23:59:59',
    granuleThumbnail: '/fake/path/image.jpg',
    title: 'Granule title',
    dataLinks: [
      {
        rel: 'http://linkrel/data#',
        title: 'linktitle',
        href: 'http://linkhref'
      }
    ],
    s3Links: []
  }
}

const setup = setupTest({
  Component: GranuleResultsItem,
  defaultProps,
  defaultZustandState: {
    granule: {
      setGranuleId: jest.fn()
    },
    project: {
      addGranuleToProjectCollection: jest.fn(),
      removeGranuleFromProjectCollection: jest.fn()
    }
  },
  withApolloClient: true,
  withRouter: true
})

beforeEach(() => {
  ReactDOM.createPortal = jest.fn((dropdown) => dropdown)
})

describe('GranuleResultsItem component', () => {
  test('renders itself correctly', () => {
    setup({
      overrideProps: cmrProps
    })

    expect(screen.getByRole('button', { name: /Granule title/ })).toBeInTheDocument()
  })

  test('renders the add button under PortalFeatureContainer', async () => {
    setup({
      overrideProps: cmrProps
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Add granule to project' })).toBeInTheDocument()
    })
  })

  describe('when passed a focused granule', () => {
    test('adds the correct classname', () => {
      setup({
        overrideProps: focusedGranuleProps
      })

      expect(screen.getByRole('button', { name: /Granule title/ })).toHaveClass('granule-results-item--active')
    })
  })

  describe('when passed a granule id filter', () => {
    test('calls Highlighter', () => {
      const spiedSearchWords = jest.spyOn(getSearchWords, 'getSearchWords')

      setup({
        overrideProps: {
          ...cmrProps,
          readableGranuleName: ['title']
        }
      })

      expect(Highlighter).toHaveBeenCalledTimes(1)
      expect(Highlighter).toHaveBeenCalledWith(
        {
          highlightClassName: 'granule-results-item__highlighted-title',
          searchWords: [/(title)/],
          textToHighlight: 'Granule title'
        },
        {}
      )

      expect(spiedSearchWords).toHaveBeenCalledTimes(1)
    })
  })

  describe('when passed a CMR granule', () => {
    test('renders the title', () => {
      const { props } = setup({
        overrideProps: cmrProps
      })

      const { granule } = props
      const { title } = granule

      expect(screen.getByText(title)).toBeInTheDocument()
    })

    // Need to check the image src
    test('renders the image', () => {
      const { props } = setup({
        overrideProps: cmrProps
      })

      const { granule } = props
      const { title, granuleThumbnail } = granule

      expect(EDSCImage).toHaveBeenCalledTimes(1)
      expect(EDSCImage).toHaveBeenCalledWith(
        expect.objectContaining(
          {
            alt: `Browse Image for ${title}`,
            className: 'granule-results-item__thumb-image',
            height: 85,
            resizeImage: true,
            src: granuleThumbnail,
            width: 85,
            useSpinner: false
          }
        ),
        {}
      )
    })

    test('renders the start and end date', () => {
      setup({
        overrideProps: cmrProps
      })

      expect(screen.getByRole('heading', { name: 'Start' })).toBeInTheDocument()
      expect(screen.getByText('2019-04-28 00:00:00')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'End' })).toBeInTheDocument()
      expect(screen.getByText('2019-04-29 23:59:59')).toBeInTheDocument()
    })
  })

  describe('when passed s3 links', () => {
    test('displaying correct s3 data', async () => {
      const { user } = setup({
        overrideProps: cmrS3Props
      })

      await user.click(screen.getByRole('button', { name: 'Download granule data' }))
      await user.click(screen.getByRole('tab', { name: 'AWS S3 Access' }))

      expect(screen.getByRole('button', { name: 'Copy region to clipboard' }).textContent).toEqual('s3-region')
      expect(screen.getByRole('link', { name: 'Get AWS S3 Credentials' })).toHaveProperty('href', 'http://example.com/creds')
      expect(screen.getByRole('link', { name: 'View Documentation' })).toHaveProperty('href', 'http://example.com/docs')
      expect(screen.getByRole('button', { name: 'Copy AWS S3 path to clipboard' }).textContent).toEqual('linkhref')
    })
  })

  describe('when passed an OpenSearch granule', () => {
    test('renders the title', () => {
      setup({
        overrideProps: opensearchProps
      })

      expect(screen.getByRole('heading', { name: 'Granule title' })).toBeInTheDocument()
    })

    test('renders the image', () => {
      const { props } = setup({
        overrideProps: opensearchProps
      })

      const { granule } = props
      const { title, granuleThumbnail } = granule

      expect(EDSCImage).toHaveBeenCalledTimes(1)
      expect(EDSCImage).toHaveBeenCalledWith(
        expect.objectContaining(
          {
            alt: `Browse Image for ${title}`,
            className: 'granule-results-item__thumb-image',
            height: 85,
            resizeImage: false,
            src: granuleThumbnail,
            width: 85,
            useSpinner: false
          }
        ),
        {}
      )
    })

    test('renders the start and end date', () => {
      setup({
        overrideProps: opensearchProps
      })

      expect(screen.getByRole('heading', { name: 'Start' })).toBeInTheDocument()
      expect(screen.getByText('2019-04-28 00:00:00')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'End' })).toBeInTheDocument()
      expect(screen.getByText('2019-04-29 23:59:59')).toBeInTheDocument()
    })

    test('Add granule button is disabled', () => {
      setup({
        overrideProps: opensearchProps
      })

      expect(screen.getByRole('button', { name: 'Add granule to project' })).toBeDisabled()
    })
  })

  describe('when clicking the Filter Granule button', () => {
    describe('with CMR granules', () => {
      test('it removes the granule from results', async () => {
        const { props, user } = setup({
          overrideProps: cmrProps
        })

        const moreActions = screen.getByRole('button', { name: 'More actions' })
        await user.click(moreActions)

        await user.click(screen.getByRole('button', { name: 'Filter granule' }), { pointerEventsCheck: 0 })

        expect(props.onExcludeGranule.mock.calls.length).toBe(1)
        expect(props.onExcludeGranule.mock.calls[0]).toEqual([{
          collectionId: 'collectionId',
          granuleId: 'granuleId'
        }])
      })
    })

    describe('with OpenSearch granules', () => {
      test('it excludes the granule from results with a hashed granule id', async () => {
        const { props, user } = setup({
          overrideProps: opensearchProps
        })

        const moreActions = screen.getByRole('button', { name: 'More actions' })
        await user.click(moreActions)

        await user.click(screen.getByRole('button', { name: 'Filter granule' }), { pointerEventsCheck: 0 })

        expect(props.onExcludeGranule.mock.calls.length).toBe(1)
        expect(props.onExcludeGranule.mock.calls[0]).toEqual([{
          collectionId: 'collectionId',
          granuleId: '170417722'
        }])
      })
    })
  })

  describe('when no granules are in the project', () => {
    test('does not have an emphisized or deepmphisized class', () => {
      setup({
        overrideProps: cmrProps
      })

      const granuleResultsItem = screen.getByRole('button', { name: /Granule title/ })
      expect(granuleResultsItem.className).not.toContain('granule-results-item--emphisized')
      expect(granuleResultsItem.className).not.toContain('granule-results-item--deemphisized')
    })

    test('displays the add button', () => {
      setup({
        overrideProps: cmrProps
      })

      expect(screen.getByLabelText('Add granule to project')).toBeInTheDocument()
    })
  })

  describe('when displaying granules in the project', () => {
    describe('when displaying granule in the project', () => {
      test('displays the remove button', () => {
        setup({
          overrideProps: {
            ...overrideProps,
            isGranuleInProject: jest.fn(() => true),
            isCollectionInProject: true
          }
        })

        expect(screen.getByLabelText('Remove granule from project')).toBeInTheDocument()

        const granuleResultsItem = screen.getByRole('button', { name: /Granule title/ })
        expect(granuleResultsItem.className).toContain('granule-results-item--emphisized')
      })
    })

    describe('when displaying granule not in the project', () => {
      test('displays the add button', () => {
        setup({
          overrideProps: {
            ...overrideProps,
            isGranuleInProject: jest.fn(() => false),
            isCollectionInProject: true
          }
        })

        expect(screen.getByLabelText('Add granule to project')).toBeInTheDocument()

        const granuleResultsItem = screen.getByRole('button', { name: /Granule title/ })
        expect(granuleResultsItem.className).toContain('granule-results-item--deemphisized')
      })
    })
  })

  describe('when clicking the add button', () => {
    test('it adds the granule to the project', async () => {
      const { user, zustandState } = setup({
        overrideProps: cmrProps
      })

      expect(screen.getByLabelText('Add granule to project')).toBeInTheDocument()

      await user.click(screen.getByLabelText('Add granule to project'))

      expect(zustandState.project.addGranuleToProjectCollection.mock.calls.length).toBe(1)
      expect(zustandState.project.addGranuleToProjectCollection.mock.calls[0]).toEqual([{
        collectionId: 'collectionId',
        granuleId: 'granuleId'
      }])
    })

    test('is passed the metrics callback', async () => {
      const { props, user } = setup({
        overrideProps: cmrProps
      })

      expect(screen.getByLabelText('Add granule to project')).toBeInTheDocument()

      await user.click(screen.getByLabelText('Add granule to project'))

      expect(props.onMetricsAddGranuleProject.mock.calls.length).toBe(1)
      expect(props.onMetricsAddGranuleProject.mock.calls[0]).toEqual([{
        collectionConceptId: 'collectionId',
        granuleConceptId: 'granuleId',
        page: 'granules',
        view: 'list'
      }])
    })
  })

  describe('when clicking the remove button', () => {
    test('it removes the granule to the project', async () => {
      const { user, zustandState } = setup({
        overrideProps: {
          ...overrideProps,
          isGranuleInProject: jest.fn(() => true)
        }
      })

      expect(screen.getByLabelText('Remove granule from project')).toBeInTheDocument()

      await user.click(screen.getByLabelText('Remove granule from project'))

      expect(zustandState.project.removeGranuleFromProjectCollection.mock.calls.length).toBe(1)
      expect(zustandState.project.removeGranuleFromProjectCollection.mock.calls[0]).toEqual([{
        collectionId: 'collectionId',
        granuleId: 'granuleId'
      }])
    })
  })

  describe('download button', () => {
    test('is passed the metrics callback', async () => {
      const { props, user } = setup({
        overrideProps: cmrProps
      })

      const { granule, onMetricsDataAccess, collectionId } = props
      const { dataLinks } = granule
      const dataLink = dataLinks[0]
      const { href } = dataLink

      const dataLinksButton = await screen.findByRole('button', { name: 'Download granule data' })

      expect(dataLinksButton.href).toContain(href)

      await user.click(dataLinksButton)

      expect(onMetricsDataAccess).toHaveBeenCalledTimes(1)
      expect(onMetricsDataAccess).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'single_granule_download',
          collections: [{
            collectionId
          }]
        })
      )
    })
  })

  describe('download button with no link', () => {
    test('disables the button', () => {
      setup({
        overrideProps: cmrNoDownloadProps
      })

      expect(screen.queryAllByLabelText('Download granule data').length).toEqual(0)
    })
  })

  describe('without an granuleThumbnail', () => {
    test('does not render an granuleThumbnail', () => {
      setup({
        overrideProps: noThumbProps
      })

      expect(screen.queryByRole('link', { name: 'View image' })).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Granule thumbnail image')).not.toBeInTheDocument()
    })

    test('does not add the modifier class name', () => {
      setup({
        overrideProps: noThumbProps
      })

      expect(screen.getByRole('button', { name: /Granule title/ }).className).not.toContain('granule-results-item--has-thumbnail')
    })
  })

  describe('with a granuleThumbnail', () => {
    test('without a full size browse', () => {
      const { props } = setup({
        overrideProps: cmrProps
      })

      const { granule } = props
      const { title, granuleThumbnail } = granule

      expect(EDSCImage).toHaveBeenCalledTimes(1)
      expect(EDSCImage).toHaveBeenCalledWith(
        expect.objectContaining(
          {
            alt: `Browse Image for ${title}`,
            className: 'granule-results-item__thumb-image',
            height: 85,
            resizeImage: true,
            src: granuleThumbnail,
            width: 85,
            useSpinner: false
          }
        ),
        {}
      )

      expect(screen.queryByLabelText('Link to granule')).not.toBeInTheDocument()
    })

    test('with a full size browse', () => {
      const { props } = setup({
        overrideProps: withBrowseProps
      })

      const { granule } = props
      const { browseUrl } = granule

      expect(screen.getByRole('link', { name: 'Mocked Browse' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Mocked Browse' })).toHaveAttribute('href', browseUrl)
    })

    test('adds the modifier class name', () => {
      setup({
        overrideProps: withBrowseProps
      })

      expect(screen.getByRole('button', { name: /Granule title/ }).className).toContain('granule-results-item--has-thumbnail')
    })
  })

  describe('granule info button', () => {
    test('calls handleClickGranuleDetails on click', async () => {
      const { user, zustandState } = setup({
        overrideProps: cmrProps
      })

      const moreActions = screen.getByRole('button', { name: 'More actions' })
      await user.click(moreActions)

      await user.click(screen.getByRole('button', { name: 'View details' }), { pointerEventsCheck: 0 })

      expect(zustandState.granule.setGranuleId).toHaveBeenCalledTimes(1)
      expect(zustandState.granule.setGranuleId).toHaveBeenCalledWith('granuleId')
    })
  })

  describe('static coverage granules', () => {
    test('renders not provided for dates', () => {
      setup({
        overrideProps: staticCoverageProps
      })

      expect(screen.getByRole('heading', { name: 'Start' })).toBeInTheDocument()
      expect(screen.getAllByText('Not Provided')[0]).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'End' })).toBeInTheDocument()
      expect(screen.getAllByText('Not Provided')[1]).toBeInTheDocument()
    })
  })

  describe('when the generate notebook tag is added', () => {
    test('renders the generate notebook dropdown', async () => {
      setup({
        overrideProps: hasGenerateNotebookTagProps
      })

      expect(screen.getByRole('button', { name: 'Download sample notebook' })).toBeDefined()
    })
  })
})
