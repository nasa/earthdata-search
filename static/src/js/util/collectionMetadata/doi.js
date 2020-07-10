export const buildDoi = (json) => {
  const { doi } = json

  if (!doi) return undefined

  const doiText = doi.doi
  if (!doiText) return { doiLink: undefined, doiText: undefined }

  // This link varies. Clean it up so all links start from the same place.
  let doiLink = doiText.replace(/^https?:\/\//g, '')
  doiLink = doiLink.replace('doi:', '')
  doiLink = doiLink.replace('dx.doi.org/', '')
  doiLink = doiLink.replace('doi.org/', '')

  if (doiLink !== '') return { doiLink: `https://dx.doi.org/${doiLink}`, doiText }
  return { doiLink: undefined, doiText }
}

export default buildDoi
