import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import CollectionResultsBody from '../CollectionResultsBody'
import CollectionResultsList from '../CollectionResultsList'
import { collectionResultsBodyData } from './mocks'
import CollectionResultsTable from '../../CollectionResultsTable/CollectionResultsTable'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    browser: {
      name: 'browser name'
    },
    collections: {
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          id: 'collectionId',
          dataset_id: 'test dataset id',
          summary: 'test summary',
          granule_count: 42,
          has_formats: false,
          has_spatial_subsetting: false,
          has_temporal_subsetting: false,
          has_transforms: false,
          has_variables: false,
          has_map_imagery: false,
          is_cwic: false,
          is_nrt: false,
          organizations: ['test/org'],
          short_name: 'test_short_name',
          thumbnail: 'http://some.test.com/thumbnail/url.jpg',
          time_end: '2019-01-15T00:00:00.000Z',
          time_start: '2019-01-14T00:00:00.000Z',
          version_id: 2
        }
      },
      hits: '181',
      isLoaded: true,
      isLoading: false,
      loadTime: 1150,
      timerStart: null
    },
    panelView: 'list',
    portal: {
      portalId: ''
    },
    projectIds: [],
    location: {
      pathname: '/test'
    },
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    scrollContainer: (() => {
      const el = document.createElement('div')
      el.classList.add('simplebar-content-wrapper')
      return el
    })(),
    waypointEnter: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<CollectionResultsBody {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsBody component', () => {
  test('renders CollectionResultsList', () => {
    const { enzymeWrapper } = setup()

    const resultsList = enzymeWrapper.find(CollectionResultsList)

    expect(resultsList.props()).toEqual(expect.objectContaining({
      collections: [{
        ...collectionResultsBodyData
      }],
      isLoading: false,
      portal: {
        portalId: ''
      },
      projectIds: []
    }))
  })

  test('renders CollectionResultsTable', () => {
    const { enzymeWrapper } = setup({
      panelView: 'table'
    })

    const resultsTable = enzymeWrapper.find(CollectionResultsTable)

    expect(resultsTable.props()).toEqual(expect.objectContaining({
      collections: [{
        ...collectionResultsBodyData
      }],
      collectionHits: 181
    }))
  })
})
