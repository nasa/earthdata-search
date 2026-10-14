import { GetObjectCommand } from '@aws-sdk/client-s3'

import { getS3Client } from '../util/getS3Client'

// AWS S3 adapter
let s3

// In-memory cache of the indexed shortNames file, persisted across warm lambda invocations.
// See `buildShortNameIndex` for the structure
let shortNameCache

/**
 * Normalizes a shortName (or query word) for separator-insensitive comparison by
 * lowercasing it and removing `_`, `-`, `.` and `:`, e.g. `ATL-03` => `atl03`
 */
const normalizeShortName = (value) => value.toLowerCase().replace(/[_\-.:]/g, '')

/**
 * Adds an entry to a Map of key => array of entries
 */
const addToIndex = (map, key, value) => {
  if (!map.has(key)) map.set(key, [])
  map.get(key).push(value)
}

/**
 * Builds the lookup structures used to search the shortNames
 * @param {Array} collections Array of `{ shortName, version }` objects
 * @returns {Object} Index containing:
 *  - `exact`: lowercased shortName => entries
 *  - `normalized`: normalized shortName (see `normalizeShortName`) => entries
 *  - `normalizedByLength`: length => array of normalized shortNames, used to limit fuzzy comparisons
 */
const buildShortNameIndex = (collections) => {
  const exact = new Map()
  const normalized = new Map()
  const normalizedByLength = new Map()

  collections.forEach((collection) => {
    const { shortName } = collection
    if (!shortName) return

    addToIndex(exact, shortName.toLowerCase(), collection)

    const normalizedKey = normalizeShortName(shortName)
    if (!normalizedKey) return

    if (!normalized.has(normalizedKey)) {
      addToIndex(normalizedByLength, normalizedKey.length, normalizedKey)
    }

    addToIndex(normalized, normalizedKey, collection)
  })

  return {
    exact,
    normalized,
    normalizedByLength
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
 * Calculates the Optimal String Alignment (restricted Damerau-Levenshtein) distance
 * between two strings. Insertions, deletions, substitutions and transpositions of
 * adjacent characters each count as a single edit, so `alt03` => `atl03` is 1.
 * Stops early and returns `maxDistance + 1` once the distance is known to exceed `maxDistance`.
 */
const getEditDistance = (a, b, maxDistance = Infinity) => {
  if (Math.abs(a.length - b.length) > maxDistance) return maxDistance + 1

  let twoRowsBack = []
  let previousRow = Array.from({ length: b.length + 1 }, (_, j) => j)
  let previousRowMin = 0

  for (let i = 1; i <= a.length; i += 1) {
    const currentRow = [i]
    let currentRowMin = i

    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1

      let distance = Math.min(
        previousRow[j] + 1,
        currentRow[j - 1] + 1,
        previousRow[j - 1] + cost
      )

      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        distance = Math.min(distance, twoRowsBack[j - 2] + 1)
      }

      currentRow[j] = distance
      currentRowMin = Math.min(currentRowMin, distance)
    }

    // Later rows can only build on this row (+0 or +1) or the previous row (+1 via
    // a transposition), so once both are too large the final distance will be too
    if (currentRowMin > maxDistance && previousRowMin >= maxDistance) {
      return maxDistance + 1
    }

    twoRowsBack = previousRow
    previousRow = currentRow
    previousRowMin = currentRowMin
  }

  return previousRow[b.length]
}

// Words that look like versions or years (`v1`, `1.0`, `2014`) are never fuzzy matched
const versionLikeRegex = /^v?\d+(\.\d+)*$/i

// The minimum normalized length for a word to be fuzzy matched
const minimumFuzzyLength = 4

/**
 * Returns the maximum number of edits allowed when fuzzy matching a normalized word, or
 * 0 if the word should not be fuzzy matched. Only words that look like identifiers (they
 * contain a digit, a separator or multiple capital letters) are fuzzy matched to avoid
 * matching regular English words in the query.
 */
const getMaxFuzzyDistance = (word, normalizedWord) => {
  if (normalizedWord.length < minimumFuzzyLength) return 0
  if (versionLikeRegex.test(word)) return 0
  if (!/[a-z]/i.test(word)) return 0

  const looksLikeIdentifier = /\d/.test(word)
    || /[_\-.:]/.test(word)
    || /[A-Z].*[A-Z]/.test(word)

  if (!looksLikeIdentifier) return 0

  return normalizedWord.length >= 8 ? 2 : 1
}

/**
 * Returns the entries of the closest shortNames within the allowed edit distance. If
 * multiple shortNames are tied for the closest distance, entries for all of them are returned.
 * @param {Object} index Index created by `buildShortNameIndex`
 * @param {String} word Word to match against the shortName index
 * @param {String} normalizedWord Normalized form of the word for fuzzy matching
 * @returns {Object|null} Matching shortName entries with `entries`, `matchType`, and `distance`, or `null` if no match is found
 */
const findFuzzyEntries = (index, word, normalizedWord) => {
  const maxDistance = getMaxFuzzyDistance(word, normalizedWord)
  if (maxDistance === 0) return null

  const { normalized, normalizedByLength } = index

  let bestDistance = maxDistance + 1
  let bestKeys = []

  for (
    let length = normalizedWord.length - maxDistance;
    length <= normalizedWord.length + maxDistance;
    length += 1
  ) {
    const keys = normalizedByLength.get(length) || []

    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      const distance = getEditDistance(normalizedWord, key, Math.min(maxDistance, bestDistance))

      if (distance < bestDistance) {
        bestDistance = distance
        bestKeys = [key]
      } else if (distance === bestDistance && distance <= maxDistance) {
        bestKeys.push(key)
      }
    }
  }

  if (bestKeys.length === 0) return null

  return {
    entries: bestKeys.flatMap((key) => normalized.get(key)),
    matchType: 'fuzzy',
    distance: bestDistance
  }
}

/**
 * Returns the shortName entries matching the given word. Matching is attempted in order of:
 *  1. `exact`: case-insensitive match of the word, as typed or with surrounding punctuation removed
 *  2. `normalized`: match ignoring `_`, `-`, `.` and `:` separators, e.g. `ATL-03` => `ATL03`
 *  3. `fuzzy`: closest shortNames within a small edit distance, e.g. `ALT03` => `ATL03`
 *
 * @param {Object} index Index created by `buildShortNameIndex`
 * @param {String} word Word to match against the shortName index
 * @returns {Object|null} Matching shortName entries with `entries`, `matchType`, and `distance`, or `null` if no match is found
 */
const findShortNameEntries = (index, word) => {
  const candidates = [word, stripPunctuation(word)].filter(Boolean)

  const exactEntries = candidates
    .map((candidate) => index.exact.get(candidate.toLowerCase()))
    .find((entries) => entries && entries.length > 0)

  if (exactEntries) {
    return {
      entries: exactEntries,
      matchType: 'exact',
      distance: 0
    }
  }

  const normalizedCandidates = [...new Set(candidates.map(normalizeShortName))].filter(Boolean)

  const normalizedEntries = normalizedCandidates
    .map((candidate) => index.normalized.get(candidate))
    .find((entries) => entries && entries.length > 0)

  if (normalizedEntries) {
    return {
      entries: normalizedEntries,
      matchType: 'normalized',
      distance: 0
    }
  }

  const strippedWord = stripPunctuation(word)
  if (!strippedWord) return null

  return findFuzzyEntries(index, strippedWord, normalizeShortName(strippedWord))
}

/**
 * Searches the user query for known collection shortNames (and optionally versions)
 * @param {Object} index Index created by `buildShortNameIndex`
 * @param {String} query User query, e.g. `USGS_P-11_cells v1 in Maryland in 2014`
 * @returns {Object} Object containing `matches` and `remainingQuery`
 */
const searchShortNames = (index, query) => {
  const words = query.trim().split(/\s+/).filter(Boolean)

  // Indexes of the words that matched a shortName or version and should be removed
  const matchedWordIndexes = new Set()
  const matches = []

  words.forEach((word, wordIndex) => {
    const shortNameResult = findShortNameEntries(index, word)
    if (!shortNameResult) return

    const { entries, matchType, distance } = shortNameResult

    matchedWordIndexes.add(wordIndex)

    // Look for a version in the other words of the query
    let versionMatch
    words.some((otherWord, otherIndex) => {
      if (otherIndex === wordIndex) return false

      const normalizedWord = normalizeVersion(stripPunctuation(otherWord) || otherWord)
      const entry = entries.find(({ version }) => (
        version != null && normalizeVersion(version) === normalizedWord
      ))

      if (entry) {
        versionMatch = {
          entry,
          word: otherWord,
          index: otherIndex
        }

        return true
      }

      return false
    })

    if (versionMatch) {
      matchedWordIndexes.add(versionMatch.index)

      matches.push({
        ...versionMatch.entry,
        shortNameMatch: word,
        versionMatch: versionMatch.word,
        matchType,
        distance
      })

      return
    }

    // No version was found in the query, return each matching shortName once without a version
    const uniqueShortNames = [...new Set(entries.map(({ shortName }) => shortName))]

    uniqueShortNames.forEach((shortName) => {
      matches.push({
        shortName,
        shortNameMatch: word,
        versionMatch: null,
        matchType,
        distance
      })
    })
  })

  const remainingQuery = words
    .filter((_, wordIndex) => !matchedWordIndexes.has(wordIndex))
    .join(' ')

  return {
    matches,
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
      matches: [],
      remainingQuery: userQuery
    }
  }
}
