import { buildDataCenters } from './collectionMetadata/dataCenters'
import { buildDoi } from './collectionMetadata/doi'
import { buildGibsLayers } from './collectionMetadata/gibsLayers'
import { buildRelatedUrls } from './collectionMetadata/relatedUrls'
import { buildScienceKeywords } from './collectionMetadata/scienceKeywords'
import { buildSpatial } from './collectionMetadata/spatial'
import { buildTemporal } from './collectionMetadata/temporal'
import { buildUrls } from './collectionMetadata/buildUrls'

export const getFocusedCollectionMetadata = (collectionId, collections) => {
  if (!collections) return {}

  const collection = collections.byId[collectionId]

  if (!collection) return {}

  return {
    [collectionId]: {
      ...collection
    }
  }
}

export const createFocusedCollectionMetadata = (json, ummJson) => {
  console.warn('args', [json, ummJson])

  // Metadata from the CMR .json response
  const jsonMetadata = {
    boxes: json.boxes,
    gibsLayers: buildGibsLayers(json),
    hasGranules: json.has_granules,
    id: json.id,
    isQwic: json.is_cwic,
    lines: json.lines,
    points: json.points,
    polygons: json.polygons,
    shortName: json.short_name,
    summary: json.summary,
    tags: json.tags,
    timeStart: json.time_start,
    timeEnd: json.time_end,
    title: json.title,
    urls: buildUrls(json),
    versionId: json.version_id
  }

  // Metadata from the CMR .umm_json response
  const ummJsonMetadata = {
    dataCenters: buildDataCenters(ummJson),
    doi: buildDoi(ummJson),
    relatedUrls: buildRelatedUrls(ummJson),
    scienceKeywords: buildScienceKeywords(ummJson),
    temporal: buildTemporal(ummJson),
    spatial: buildSpatial(ummJson)
  }

  console.log('response', {
    ...jsonMetadata,
    ...ummJsonMetadata
  })

  return {
    ...jsonMetadata,
    ...ummJsonMetadata
  }
}
