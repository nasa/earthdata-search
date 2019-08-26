/**
 * Construct and trigger the browser to download a string as a file
 * @param {String} contents The data to write to the file
 * @param {String} name What to name the file
 * @param {String} type The filetype of the file to create
 */
export const constructDownloadableFile = (contents, name, type = 'text/plain;charset:utf-8') => {
  // TODO: Ensure that downloads work on supported versions of IE
  const clickableElement = document.createElement('a')
  const fileObject = new Blob([contents], { type })
  clickableElement.href = URL.createObjectURL(fileObject)
  clickableElement.download = name

  // Required for file downloads to work in Firefox
  document.body.appendChild(clickableElement)

  clickableElement.click()
}

export default constructDownloadableFile
