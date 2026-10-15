import { GetObjectCommand } from '@aws-sdk/client-s3'

import { getS3Client } from '../util/getS3Client'

// AWS S3 adapter
let s3

// In-memory cache of the indexed shortNames file, persisted across warm lambda invocations.
// See `buildShortNameIndex` for the structure
let shortNameCache

/**
 * Clears the in-memory cache of the indexed shortNames file
 */
export const clearShortNameCache = () => {
  shortNameCache = null
}

/**
 * Normalizes a shortName (or query word) for separator-insensitive comparison by
 * lowercasing it and removing `_`, `-`, `.` and `:`, e.g. `ATL-03` => `atl03`
 */
const normalizeShortName = (value) => value.toLowerCase().replace(/[_\-.:]/g, '')

/**
 * Builds the entry id for a collection, e.g. `ATL03_006`
 */
const getEntryId = ({ shortName, version }) => `${shortName}_${version}`

/**
 * Adds an entry to a Map of key => array of entries
 */
const addToIndex = (map, key, value) => {
  if (!map.has(key)) map.set(key, [])
  map.get(key).push(value)
}

/**
 * Builds the lookup structures used to search the shortNames
 * @param {Array} collections Array of `{ shortName, version, includeInactiveCollections, hasGranules }` objects
 * @returns {Object} Index containing:
 *  - `exact`: lowercased shortName => entries
 *  - `normalized`: normalized shortName (see `normalizeShortName`) => entries
 *  - `entryIds`: lowercased entry id (`<shortName>_<version>`) => entry
 */
const buildShortNameIndex = (collections) => {
  const exact = new Map()
  const normalized = new Map()
  const entryIds = new Map()

  collections.forEach((collection) => {
    const { shortName, version } = collection
    if (!shortName) return

    addToIndex(exact, shortName.toLowerCase(), collection)

    if (version != null) {
      entryIds.set(getEntryId(collection).toLowerCase(), collection)
    }

    const normalizedKey = normalizeShortName(shortName)
    if (!normalizedKey) return

    addToIndex(normalized, normalizedKey, collection)
  })

  return {
    exact,
    normalized,
    entryIds
  }
}

/**
 * Loads the shortNames file from S3 and indexes it. The result is cached in lambda
 * memory so S3 is only read on cold starts.
 */
const loadShortNames = async () => {
  if (shortNameCache) return shortNameCache

  if (s3 == null) {
    s3 = getS3Client()
  }

  const {
    NLP_SHORT_NAME_FILE_BUCKET_NAME: bucketName = 'nlpShortNamesCache',
    NLP_SHORT_NAME_FILE_KEY: key = 'nlpShortNamesCache.json'
  } = process.env

  const response = await s3.send(new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  }))

  const fileContents = await response.Body.transformToString()
  const collections = JSON.parse(fileContents)

  shortNameCache = buildShortNameIndex(collections)

  return shortNameCache
}

/**
 * Removes leading/trailing punctuation from a word, e.g. `"MOD11A1,"` => `MOD11A1`
 */
const stripPunctuation = (word) => word.replace(/^[^\w]+|[^\w]+$/g, '')

/**
 * Normalizes a version string for comparison, removing an optional leading `v` and any
 * leading zeros from each numeric segment, e.g. `v004` => `4`, `006.01` => `6.1`
 */
const normalizeVersion = (version) => String(version)
  .trim()
  .toLowerCase()
  .replace(/^v(?=\w)/, '')
  .split('.')
  .map((segment) => (/^\d+$/.test(segment) ? String(Number(segment)) : segment))
  .join('.')

/**
 * Compares two versions segment by segment, numerically where both segments are numbers,
 * e.g. `007` > `006.01` > `004`, and `10` > `9`
 * @returns {Number} Positive if `a` is greater, negative if `b` is greater, otherwise 0
 */
const compareVersions = (a, b) => {
  const aSegments = normalizeVersion(a).split('.')
  const bSegments = normalizeVersion(b).split('.')

  for (let i = 0; i < Math.max(aSegments.length, bSegments.length); i += 1) {
    const aSegment = aSegments[i]
    const bSegment = bSegments[i]

    // A version with more segments is greater, e.g. `6.1` > `6`
    if (aSegment === undefined) return -1
    if (bSegment === undefined) return 1

    const bothNumeric = /^\d+$/.test(aSegment) && /^\d+$/.test(bSegment)
    const difference = bothNumeric
      ? Number(aSegment) - Number(bSegment)
      : aSegment.localeCompare(bSegment)

    if (difference !== 0) return difference
  }

  return 0
}

/**
 * Returns the entry with the greatest version for each shortName in the given entries
 */
const getLatestVersionEntries = (entries) => {
  const latestByShortName = new Map()

  entries.forEach((entry) => {
    const latest = latestByShortName.get(entry.shortName)

    if (
      !latest
      || latest.version == null
      || (entry.version != null && compareVersions(entry.version, latest.version) > 0)
    ) {
      latestByShortName.set(entry.shortName, entry)
    }
  })

  return [...latestByShortName.values()]
}

/**
 * Returns the entry matching the given word as an entry id, as typed or with surrounding
 * punctuation removed, e.g. `atl03_006` => the `ATL03` version `006` entry
 * @param {Object} index Index created by `buildShortNameIndex`
 * @param {String} word Word to match against the entry id index
 * @returns {Object|null} Matching entry, or `null` if no match is found
 */
const findEntryIdEntry = (index, word) => {
  const candidates = [word, stripPunctuation(word)].filter(Boolean)

  const entry = candidates
    .map((candidate) => index.entryIds.get(candidate.toLowerCase()))
    .find(Boolean)

  return entry || null
}

/**
 * Returns the shortName entries matching the given word. Matching is attempted in order of:
 *  1. `exact`: case-insensitive match of the word, as typed or with surrounding punctuation removed
 *  2. `normalized`: case-insensitive match ignoring `_`, `-`, `.` and `:` separators, e.g. `ATL-03` => `ATL03`
 *
 * @param {Object} index Index created by `buildShortNameIndex`
 * @param {String} word Word to match against the shortName index
 * @returns {Array|null} Matching shortName entries, or `null` if no match is found
 */
const findShortNameEntries = (index, word) => {
  const candidates = [word, stripPunctuation(word)].filter(Boolean)

  const exactEntries = candidates
    .map((candidate) => index.exact.get(candidate.toLowerCase()))
    .find((entries) => entries && entries.length > 0)

  if (exactEntries) return exactEntries

  const normalizedCandidates = [...new Set(candidates.map(normalizeShortName))].filter(Boolean)

  const normalizedEntries = normalizedCandidates
    .map((candidate) => index.normalized.get(candidate))
    .find((entries) => entries && entries.length > 0)

  return normalizedEntries || null
}

/**
 * Searches the user query for known collection shortNames (and optionally versions).
 * A word that is an entry id (`<shortName>_<version>`), or a shortName immediately followed
 * by one of its versions, is returned as an entry id. Otherwise it is returned as a shortName.
 *
 * Each match is a group of entries (every version of a matched shortName, or the single
 * version of a matched entry id). The groups determine the returned flags:
 *  - `includeInactiveCollections`: `true` if any match has `isActive: false` for every entry
 *    in its group, otherwise `false`
 *  - `hasGranulesOrCwic`: `true`, or `undefined` if any match does not have granules. For a
 *    shortName matched without a version, only its greatest version is checked
 * @param {Object} index Index created by `buildShortNameIndex`
 * @param {String} query User query, e.g. `USGS_P-11_cells v1 in Maryland in 2014`
 * @returns {Object} Object containing `shortNames`, `entryIds`, `includeInactiveCollections`,
 * `hasGranulesOrCwic` and `remainingQuery`
 */
const searchShortNames = (index, query) => {
  const words = query.trim().split(/\s+/).filter(Boolean)

  // Indexes of the words that matched a shortName or version and should be removed
  const matchedWordIndexes = new Set()
  const shortNames = new Set()
  const entryIds = new Set()
  // One array of entries per match, see above
  const matchedGroups = []
  // The entries whose `hasGranules` value is used for each match, see above
  const granuleEntries = []

  words.forEach((word, wordIndex) => {
    // Skip words already consumed as the version of the previous shortName
    if (matchedWordIndexes.has(wordIndex)) return

    const entryIdEntry = findEntryIdEntry(index, word)

    if (entryIdEntry) {
      matchedWordIndexes.add(wordIndex)
      entryIds.add(getEntryId(entryIdEntry))
      matchedGroups.push([entryIdEntry])
      granuleEntries.push(entryIdEntry)

      return
    }

    const entries = findShortNameEntries(index, word)
    if (!entries) return

    matchedWordIndexes.add(wordIndex)

    // A version is only matched if it is the word immediately following the shortName
    const nextIndex = wordIndex + 1
    const nextWord = words[nextIndex]

    if (nextWord) {
      const normalizedWord = normalizeVersion(stripPunctuation(nextWord) || nextWord)
      const entry = entries.find(({ version }) => (
        version != null && normalizeVersion(version) === normalizedWord
      ))

      if (entry) {
        matchedWordIndexes.add(nextIndex)
        entryIds.add(getEntryId(entry))
        matchedGroups.push([entry])
        granuleEntries.push(entry)

        return
      }
    }

    entries.forEach(({ shortName }) => shortNames.add(shortName))
    matchedGroups.push(entries)
    granuleEntries.push(...getLatestVersionEntries(entries))
  })

  const remainingQuery = words
    .filter((_, wordIndex) => !matchedWordIndexes.has(wordIndex))
    .join(' ')

  const includeInactiveCollections = matchedGroups.some((group) => group.every(
    (entry) => entry.isActive !== true
  ))

  const hasGranulesOrCwic = granuleEntries.some((entry) => entry.hasGranules === false)
    ? undefined
    : true

  return {
    shortNames: [...shortNames],
    entryIds: [...entryIds],
    includeInactiveCollections,
    hasGranulesOrCwic,
    remainingQuery
  }
}

/**
 * Performs a short name search on the user query
 * @param {String} userQuery User query, e.g. `USGS_P-11_cells v1 in Maryland in 2014`
 */
export const shortNameSearch = async (userQuery) => {
  try {
    const index = await loadShortNames()

    return searchShortNames(index, userQuery)
  } catch (error) {
    console.error('Error performing short name search:', error)

    return {
      shortNames: [],
      entryIds: [],
      includeInactiveCollections: false,
      hasGranulesOrCwic: undefined,
      remainingQuery: userQuery
    }
  }
}
