export const collectionListItemProps = {
  collection: {
    collectionId: 'collectionId1',
    datasetId: 'Test Collection',
    description: 'This is a short summary.',
    displayOrganization: 'TESTORG',
    granuleCount: 10,
    hasFormats: false,
    hasSpatialSubsetting: false,
    hasTemporalSubsetting: false,
    hasTransforms: false,
    hasVariables: false,
    isCollectionInProject: false,
    isCwic: false,
    isLast: false,
    isNrt: false,
    shortName: 'cId1',
    thumbnail: 'http://some.test.com/thumbnail/url.jpg',
    temporalRange: '2010-10-10 to 2011-10-10',
    versionId: '2'
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
  waypointEnter: jest.fn()
}

export const longSummary = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
