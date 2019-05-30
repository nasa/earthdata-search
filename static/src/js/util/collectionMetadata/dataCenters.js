export const buildDataCenters = (ummJson) => {
  const dataCenters = ummJson.DataCenters
  if (!dataCenters || !dataCenters.length) return undefined

  return dataCenters.map(dataCenter => ({
    shortname: `${dataCenter.ShortName.toLowerCase() === 'not provided' ? 'Name Not Provided' : dataCenter.ShortName}`,
    longname: dataCenter.LongName,
    roles: dataCenter.Roles,
    contactInformation: dataCenter.ContactInformation ? dataCenter.ContactInformation : undefined
  }))
}

export default buildDataCenters
