/**
 * Generates a SHA1 digest of the echoform, used to determine if the saved
 * EchoForm data is up to date with the current EchoForm
 * @param {String} form EchoForm string
 */
export const generateFormDigest = (form) => {
  const formDigest = Buffer.from(form).toString('base64')

  return formDigest
}
