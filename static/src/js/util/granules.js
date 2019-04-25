const populateGranuleResults = (collectionId, isCwic, response) => {
  const payload = {}

  payload.collectionId = collectionId
  payload.results = response.data.feed.entry
  payload.isCwic = isCwic

  if (isCwic) {
    payload.hits = response.data.feed.hits
  } else {
    payload.hits = parseInt(response.headers['cmr-hits'], 10)
  }

  return payload
}

export default populateGranuleResults
