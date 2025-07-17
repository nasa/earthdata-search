const getProjectCollections = `
  query GetProjectCollections (
    $params: CollectionsInput,
    $subcriptionParams: SubscriptionsInput,
    $variableParams: VariablesInput
  ) {
    collections (
      params: $params
    ) {
      items {
        abstract
        archiveAndDistributionInformation
        associatedDois
        boxes
        cloudHosted
        conceptId
        coordinateSystem
        dataCenter
        dataCenters
        dataQualitySummaries {
          count
          items {
            id
            summary
          }
        }
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
        points
        polygons
        relatedCollections (
          limit: 3
        ) {
          count
          items {
            id
            title
          }
        }
        relatedUrls
        scienceKeywords
        shortName
        spatialExtent
        tags
        temporalExtents
        tilingIdentificationSystems
        timeEnd
        timeStart
        title
        versionId
        services {
          count
          items {
            conceptId
            description
            longName
            name
            type
            url
            serviceOptions
            supportedOutputProjections
            supportedReformattings
            maxItemsPerOrder
            orderOptions {
              count
              items {
                conceptId
                revisionId
                name
                form
              }
            }
            variables {
              count
              items {
                conceptId
                definition
                longName
                name
                nativeId
                scienceKeywords
              }
            }
          }
        }
        granules {
          count
          items {
            browseFlag
            conceptId
            onlineAccessFlag
            links
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
            query
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
  }
`

export default getProjectCollections
