import md5 from 'md5'

/**
 * Generates an md5 encoding of the echoform, used to determine if the saved
 * EchoForm data is up to date with the current EchoForm
 * @param {String} form EchoForm string
 */
export const generateFormDigest = (form) => {
  const formDigest = md5(form)

  return formDigest
}
