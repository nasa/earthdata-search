export const buildDataCenters = (json) => {
  const { dataCenters } = json

  if (!dataCenters || !dataCenters.length) return undefined

  return dataCenters.map((dataCenter) => ({
    shortname: `${dataCenter.shortName.toLowerCase() === 'not provided' ? 'Name Not Provided' : dataCenter.shortName}`,
    longname: dataCenter.longName,
    roles: dataCenter.roles,
    contactInformation: dataCenter.contactInformation ? dataCenter.contactInformation : undefined
  }))
}

export default buildDataCenters
