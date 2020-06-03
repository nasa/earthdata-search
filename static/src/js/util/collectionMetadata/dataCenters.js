export const buildDataCenters = (ummJson) => {
  const dataCenters = ummJson.data_centers
  if (!dataCenters || !dataCenters.length) return undefined

  return dataCenters.map(dataCenter => ({
    shortname: `${dataCenter.short_name.toLowerCase() === 'not provided' ? 'Name Not Provided' : dataCenter.short_name}`,
    longname: dataCenter.long_name,
    roles: dataCenter.roles,
    contactInformation: dataCenter.contact_information ? dataCenter.contact_information : undefined
  }))
}

export default buildDataCenters
