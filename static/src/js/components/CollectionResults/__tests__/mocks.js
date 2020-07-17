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
  portal: {
    features: {
      authentication: true
    }
  },
  onAddProjectCollection: jest.fn(),
  onRemoveCollectionFromProject: jest.fn(),
  onViewCollectionGranules: jest.fn(),
  onViewCollectionDetails: jest.fn()
}

export const longSummary = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

export const collectionResultsBodyData = {
  collectionId: 'collectionId',
  datasetId: 'test dataset id',
  description: 'test summary',
  displayOrganization: 'test/org',
  granuleCount: 42,
  hasFormats: false,
  hasMapImagery: false,
  hasSpatialSubsetting: false,
  hasTemporalSubsetting: false,
  hasTransforms: false,
  hasVariables: false,
  isCollectionInProject: false,
  isCwic: false,
  isLast: true,
  isNrt: false,
  shortName: 'test_short_name',
  temporalEnd: '2019-01-15',
  temporalRange: '2019-01-14 to 2019-01-15',
  temporalStart: '2019-01-14',
  thumbnail: 'http://some.test.com/thumbnail/url.jpg',
  versionId: 2
}

export const collectionData = [{
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
  isLast: true,
  isNrt: false,
  shortName: 'cId1',
  thumbnail: 'http://some.test.com/thumbnail/url.jpg',
  temporalRange: '2010-10-10 to 2011-10-10',
  versionId: '2'
}]
