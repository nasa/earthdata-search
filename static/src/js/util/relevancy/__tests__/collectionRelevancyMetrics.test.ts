import nock from 'nock'

import { collectionRelevancyMetrics } from '../collectionRelevancyMetrics'
// @ts-expect-error This file does not have types
import LoggerRequest from '../../request/loggerRequest'
import useEdscStore from '../../../zustand/useEdscStore'

describe('collectionRelevancyMetrics', () => {
  test('should call LoggerRequest.logRelevancy', () => {
    nock(/localhost/)
      .post(/relevancy_logger/)
      .reply(200)

    useEdscStore.setState((state) => {
      /* eslint-disable no-param-reassign */
      state.collection.collectionId = 'collection2'
      state.collection.collectionMetadata = {
        collection1: {
          conceptId: 'collection1'
        },
        collection2: {
          conceptId: 'collection2'
        }
      }

      state.collections.collections = {
        count: 2,
        items: [{
          conceptId: 'collection1',
          id: 'collection1'
        }, {
          conceptId: 'collection2',
          id: 'collection2'
        }],
        isLoaded: false,
        isLoading: false,
        loadTime: null
      }
      /* eslint-enable no-param-reassign */
    })

    const loggerSpy = jest.spyOn(LoggerRequest.prototype, 'logRelevancy')

    collectionRelevancyMetrics()

    expect(loggerSpy).toHaveBeenCalledTimes(1)
    expect(loggerSpy).toHaveBeenCalledWith({
      data: {
        collections: ['collection1', 'collection2'],
        exact_match: false,
        query: {
          boundingBox: undefined,
          circle: undefined,
          cloudHosted: undefined,
          collectionDataType: undefined,
          concept_id: undefined,
          consortium: [],
          dataCenter: undefined,
          dataCenterH: undefined,
          echoCollectionId: undefined,
          facetsSize: undefined,
          granuleDataFormat: undefined,
          granuleDataFormatH: undefined,
          hasGranulesOrCwic: true,
          horizontalDataResolutionRange: undefined,
          includeFacets: 'v2',
          includeGranuleCounts: true,
          includeHasGranules: true,
          includeTags: 'edsc.*,opensearch.granule.osdd',
          instrument: undefined,
          instrumentH: undefined,
          keyword: undefined,
          latency: undefined,
          line: undefined,
          options: {},
          pageNum: 1,
          pageSize: 20,
          platform: undefined,
          platformsH: undefined,
          point: undefined,
          polygon: undefined,
          processingLevelIdH: undefined,
          project: undefined,
          projectH: undefined,
          provider: undefined,
          scienceKeywordsH: undefined,
          serviceType: [],
          sortKey: ['has_granules_or_cwic', '-score', '-create-data-date'],
          spatialKeyword: undefined,
          standardProduct: undefined,
          tagKey: [],
          temporal: undefined,
          toolConceptId: undefined,
          twoDCoordinateSystemName: undefined
        },
        selected_collection: 'collection2',
        selected_index: 1
      }
    })
  })
})
