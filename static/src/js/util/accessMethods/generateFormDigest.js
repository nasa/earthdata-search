import forge from 'node-forge'

/**
 * Generates a SHA1 digest of the echoform, used to determine if the saved
 * EchoForm data is up to date with the current EchoForm
 * @param {String} form EchoForm string
 */
export const generateFormDigest = (form) => {
  const formDigest = forge.md.sha1.create()
  formDigest.update(form)

  return formDigest.digest().toHex()
}
