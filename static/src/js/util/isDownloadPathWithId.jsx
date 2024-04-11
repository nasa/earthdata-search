/**
 * Returns true if the pathname is the download page with a retrieval ID
 * @param {string} pathname - The pathname to check.
 * @return {boolean}
 */
export const isDownloadPathWithId = (pathname) => {
  const regex = /\/downloads\/\d+/

  return !!pathname.match(regex)
}

export default isDownloadPathWithId
