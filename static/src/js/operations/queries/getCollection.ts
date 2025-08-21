const GET_COLLECTION = `
  query GetCollection(
    $params: CollectionInput
    $subcriptionParams: SubscriptionsInput
    $variableParams: VariablesInput
  ) {
    collection (params: $params) {
      abstract
      archiveAndDistributionInformation
      associatedDois
      boxes
      cloudHosted
      conceptId
      coordinateSystem
      consortiums
      dataCenter
      dataCenters
      directDistributionInformation
      doi
      duplicateCollections {
        count
        items {
          id
        }
      }
      hasGranules
      lines
      nativeDataFormats
      points
      polygons
      relatedUrls
      relatedCollections (
        limit: 3
      ) {
        count
        items {
          id
          title
        }
      }
      scienceKeywords
      shortName
      spatialExtent
      tags
      temporalExtents
      timeStart
      timeEnd
      tilingIdentificationSystems
      title
      versionId
      services {
        count
        items {
          conceptId
          longName
          name
          type
          url
          serviceOptions
          supportedOutputProjections
          supportedReformattings
        }
      }
      granules {
        count
        items {
          conceptId
          onlineAccessFlag
        }
      }
      subscriptions (
        params: $subcriptionParams
      ) {
        count
        items {
          collectionConceptId
          conceptId
          name
          nativeId
          query
          type
        }
      }
      tools {
        count
        items {
          longName
          name
          potentialAction
        }
      }
      variables (
        params: $variableParams
      ) {
        count
        cursor
        items {
          conceptId
          definition
          instanceInformation
          longName
          name
          nativeId
          scienceKeywords
        }
      }
    }
  }
`

export default GET_COLLECTION
