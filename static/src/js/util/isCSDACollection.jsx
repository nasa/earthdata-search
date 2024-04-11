import { isArray } from 'lodash'

/**
 * Returns true if passed a matching data center/organization
 * @param {Array} dataCenters - The data centers from the collection metadata
 * @return {Boolean}
 */
export const isCSDACollection = (dataCenters) => !!(
  isArray(dataCenters)
  && (
    dataCenters.some(({ shortName = '' }) => shortName === 'NASA/CSDA')
    || dataCenters.some((dataCenter) => dataCenter === 'NASA/CSDA')
  )
)

export default isCSDACollection
