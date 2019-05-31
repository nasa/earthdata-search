/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import { PropTypes } from 'prop-types'
import { convertSizeToMB, convertSize } from '../../util/project'


/**
 * Renders ProjectHeader.
 * @param {object} props - The props passed into the component.
 * @param {object} props.collections - Collections passed from redux store.
 */
const ProjectHeader = ({
  collections
}) => {
  const { byId, projectIds } = collections

  let totalGranules = 0
  let size = 0
  projectIds.forEach((collectionId) => {
    const collection = byId[collectionId]
    const { granules } = collection
    const { hits, totalSize: granuleSize } = granules

    totalGranules += hits
    const convertedSize = convertSizeToMB(granuleSize)
    size += convertedSize
  })

  const totalSize = convertSize(size)
  const {
    size: totalProjectSize,
    unit: totalUnit
  } = totalSize

  return (
    <div>
      <p className="total-granules">{`${totalGranules} Granules`}</p>
      <p className="total-collections">{`${projectIds.length} Collections`}</p>
      <p className="total-size">{`${totalProjectSize} ${totalUnit}`}</p>
    </div>
  )
}

ProjectHeader.propTypes = {
  collections: PropTypes.shape({}).isRequired
}

export default ProjectHeader
