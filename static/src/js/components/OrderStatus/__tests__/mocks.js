export const retrievalStatus = {
  retrieval: {
    id: '7',
    obfuscatedId: '7',
    retrievalCollections: [{
      obfuscatedId: '12345',
      collectionId: 'TEST_COLLECTION_111',
      collectionMetadata: {
        id: 'TEST_COLLECTION_111',
        datasetId: 'Test Dataset ID',
        relatedCollections: {
          count: 3,
          items: [
            {
              doi: '1.TEST.DOI',
              id: 'TEST_COLLECTION_1_1',
              relationships: [
                {
                  relationshipType: 'relatedUrl'
                }
              ],
              title: 'Test Title 1_1'
            },
            {
              doi: '2.TEST.DOI',
              id: 'TEST_COLLECTION_2_1',
              relationships: [
                {
                  relationshipType: 'relatedUrl'
                }
              ],
              title: 'Test Title 2_1'
            },
            {
              doi: '3.TEST.DOI',
              id: 'TEST_COLLECTION_3_1',
              relationships: [
                {
                  relationshipType: 'relatedUrl'
                }
              ],
              title: 'Test Title 3_1'
            }
          ]
        }
      },
      links: [
        {
          title: 'Test Dataset ID',
          links: [
            {
              url: 'http://linkurl.com/test',
              type: 'HOME PAGE'
            }
          ]
        }
      ]
    }, {
      obfuscatedId: '98765',
      collectionId: 'TEST_COLLECTION_222',
      collectionMetadata: {
        id: 'TEST_COLLECTION_222',
        datasetId: 'Test Dataset ID',
        relatedCollections: {
          count: 2,
          items: [
            {
              doi: '1.TEST.DOI',
              id: 'TEST_COLLECTION_1_2',
              relationships: [
                {
                  relationshipType: 'relatedUrl'
                }
              ],
              title: 'Test Title 1_2'
            },
            {
              doi: '2.TEST.DOI',
              id: 'TEST_COLLECTION_2_2',
              relationships: [
                {
                  relationshipType: 'relatedUrl'
                }
              ],
              title: 'Test Title 2_2'
            }
          ]
        }
      },
      links: null
    }],
    jsondata: {
      source: '?test=source_link'
    }
  }
}

export const retrievalStatusPropsTwo = {
  retrieval: {
    id: '7',
    obfuscatedId: '7',
    retrievalCollections: [{
      obfuscatedId: '12345',
      collectionId: 'TEST_COLLECTION_111',
      collectionMetadata: {
        datasetId: 'Test Dataset ID 2'
      },
      links: [
        {
          title: 'Test Dataset ID',
          links: [
            {
              url: 'http://linkurl.com/test',
              type: 'HOME PAGE'
            }
          ]
        }
      ]
    }],
    jsondata: {
      source: '?test=source_link'
    }
  }
}
