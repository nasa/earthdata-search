/**
 * Given a filepath, returns the filename and extension
 * @param {String} path A filepath
 * @returns {String} A filename with extension
 */
export const getFilenameFromPath = (path) => {
  if (!path) return ''
  return path.substring(path.lastIndexOf('/') + 1)
}
