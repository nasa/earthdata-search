export const getProjectCollectionsResponse = [
  {
    collectionId1: {
      isCwic: false,
      formattedMetadata: {
        dataCenters: undefined,
        doi: undefined,
        gibsLayers: [
          'None'
        ],
        nativeFormats: [],
        relatedUrls: [],
        scienceKeywords: [],
        spatial: undefined,
        temporal: [
          'Not available'
        ],
        urls: {
          atom: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.atom&token=token',
            title: 'ATOM'
          },
          dif: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.dif&token=token',
            title: 'DIF'
          },
          echo10: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.echo10&token=token',
            title: 'ECHO10'
          },
          html: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.html&token=token',
            title: 'HTML'
          },
          iso19115: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.iso19115&token=token',
            title: 'ISO19115'
          },
          native: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.native&token=token',
            title: 'Native'
          },
          osdd: {
            href: 'https://cmr.earthdata.nasa.gov/opensearch/granules/descriptor_document.xml?clientId=eed-edsc-test-serverless-client&shortName=undefined&versionId=undefined&dataCenter=collectionId1',
            title: 'OSDD'
          }
        }
      },
      metadata: {
        id: 'collectionId1',
        mockCollectionData: 'goes here',
        thumbnail: 'test-file-stub'
      },
      ummMetadata: {
        data: 'collectionId1'
      }
    }
  },
  {
    collectionId2: {
      isCwic: false,
      formattedMetadata: {
        dataCenters: undefined,
        doi: undefined,
        gibsLayers: [
          'None'
        ],
        nativeFormats: [],
        relatedUrls: [],
        scienceKeywords: [],
        spatial: undefined,
        temporal: [
          'Not available'
        ],
        urls: {
          atom: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId2.atom&token=token',
            title: 'ATOM'
          },
          dif: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId2.dif&token=token',
            title: 'DIF'
          },
          echo10: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId2.echo10&token=token',
            title: 'ECHO10'
          },
          html: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId2.html&token=token',
            title: 'HTML'
          },
          iso19115: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId2.iso19115&token=token',
            title: 'ISO19115'
          },
          native: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId2.native&token=token',
            title: 'Native'
          },
          osdd: {
            href: 'https://cmr.earthdata.nasa.gov/opensearch/granules/descriptor_document.xml?clientId=eed-edsc-test-serverless-client&shortName=undefined&versionId=undefined&dataCenter=collectionId2',
            title: 'OSDD'
          }
        }
      },
      metadata: {
        id: 'collectionId2',
        mockCollectionData: 'collection data 2',
        thumbnail: 'test-file-stub'
      },
      ummMetadata: {
        data: 'collectionId2'
      }
    }
  }
]

export const getCollectionsResponseUnauth = [
  {
    collectionId: {
      isCwic: false,
      formattedMetadata: {
        dataCenters: undefined,
        doi: undefined,
        gibsLayers: [
          'None'
        ],
        nativeFormats: [],
        relatedUrls: [],
        scienceKeywords: [],
        spatial: undefined,
        temporal: [
          'Not available'
        ],
        urls: {
          atom: {
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/collectionId1.atom',
            title: 'ATOM'
          },
          dif: {
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/collectionId1.dif',
            title: 'DIF'
          },
          echo10: {
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/collectionId1.echo10',
            title: 'ECHO10'
          },
          html: {
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/collectionId1.html',
            title: 'HTML'
          },
          iso19115: {
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/collectionId1.iso19115',
            title: 'ISO19115'
          },
          native: {
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/collectionId1.native',
            title: 'Native'
          },
          osdd: {
            href: 'https://cmr.earthdata.nasa.gov/opensearch/granules/descriptor_document.xml?clientId=eed-edsc-test-serverless-client&shortName=id_1&versionId=VersionID&dataCenter=collectionId1',
            title: 'OSDD'
          }
        }
      },
      metadata: {
        id: 'collectionId1',
        short_name: 'id_1',
        version_id: 'VersionID',
        thumbnail: 'test-file-stub'
      },
      ummMetadata: {
        data: 'collectionId1'
      }
    }
  }
]

export const getCollectionsResponseAuth = [
  {
    collectionId: {
      isCwic: false,
      formattedMetadata: {
        dataCenters: undefined,
        doi: undefined,
        gibsLayers: [
          'None'
        ],
        nativeFormats: [],
        relatedUrls: [],
        scienceKeywords: [],
        spatial: undefined,
        temporal: [
          'Not available'
        ],
        urls: {
          atom: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.atom&token=token',
            title: 'ATOM'
          },
          dif: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.dif&token=token',
            title: 'DIF'
          },
          echo10: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.echo10&token=token',
            title: 'ECHO10'
          },
          html: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.html&token=token',
            title: 'HTML'
          },
          iso19115: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.iso19115&token=token',
            title: 'ISO19115'
          },
          native: {
            href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.native&token=token',
            title: 'Native'
          },
          osdd: {
            href: 'https://cmr.earthdata.nasa.gov/opensearch/granules/descriptor_document.xml?clientId=eed-edsc-test-serverless-client&shortName=id_1&versionId=VersionID&dataCenter=collectionId1',
            title: 'OSDD'
          }
        }
      },
      metadata: {
        id: 'collectionId1',
        short_name: 'id_1',
        version_id: 'VersionID',
        thumbnail: 'test-file-stub'
      },
      ummMetadata: {
        data: 'collectionId1'
      }
    }
  }
]
