export const collectionListItemProps = {
  browser: {
    name: 'browser name'
  },
  collection: {
    dataset_id: 'Test Collection',
    id: 'collectionId1',
    granule_count: 10,
    has_formats: false,
    has_spatial_subsetting: false,
    has_temporal_subsetting: false,
    has_transforms: false,
    has_variables: false,
    organizations: ['TESTORG'],
    short_name: 'cId1',
    summary: 'This is a short summary.',
    thumbnail: 'http://some.test.com/thumbnail/url.jpg',
    time_end: '2011-10-10T00:00:00.000Z',
    time_start: '2010-10-10T00:00:00.000Z',
    version_id: '2'
  },
  isCollectionInProject: false,
  isLast: false,
  onAddProjectCollection: jest.fn(),
  onRemoveCollectionFromProject: jest.fn(),
  onViewCollectionGranules: jest.fn(),
  onViewCollectionDetails: jest.fn(),
  scrollContainer: (() => {
    const el = document.createElement('div')
    el.classList.add('simplebar-content-wrapper')
    return el
  })(),
  waypointEnter: jest.fn()
}

export const longSummary = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
