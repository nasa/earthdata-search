/**
 * Downloads a file with the given content and filename.
 * @param {String} fileName File name of the file
 * @param {Object} content The content of the file
 */
export const downloadFile = (fileName, content) => {
  // Create a blob from the notebook JSON
  const blob = new Blob([JSON.stringify(content)])
  const url = window.URL.createObjectURL(blob)

  // Create a hyperlink to the blob and give it a filename
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${fileName}`)

  // Add the link to the page
  document.body.appendChild(link)

  // Click on the link to download the file to the user's computer
  link.click()

  // Remove the link from the page
  link.parentNode.removeChild(link)
}
