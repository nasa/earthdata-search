import React from 'react'
import PropTypes from 'prop-types'

import { pluralize } from '../../util/pluralize'
import { commafy } from '../../util/commafy'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

const ProjectCollectionContents = ({
  location,
  onChangePath,
  onSetActivePanelSection,
  projectCollection
}) => {
  const { granules: projectCollectionGranules } = projectCollection
  const {
    hits: granuleCount,
    addedGranuleIds,
    removedGranuleIds
  } = projectCollectionGranules

  return (
    <PortalLinkContainer
      type="button"
      className="granule-results-actions__project-pill"
      label="View granules in project"
      onClick={() => {
        onSetActivePanelSection('1')
        onChangePath(`/projects${location.search}`)
      }}
      to={{
        pathname: '/projects',
        search: location.search
      }}
    >
      <i className="fa fa-folder granule-results-actions__project-pill-icon" />
      {
        (!addedGranuleIds.length && !removedGranuleIds.length) && <span title="All granules in project">All Granules</span>
      }
      {
        (addedGranuleIds.length > 0 || removedGranuleIds.length > 0) && (
          <span
            title={`${commafy(granuleCount)} ${pluralize('granule', granuleCount)} in project`}
          >
            {`${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`}
          </span>
        )
      }
    </PortalLinkContainer>
  )
}

ProjectCollectionContents.propTypes = {
  location: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onSetActivePanelSection: PropTypes.func.isRequired,
  projectCollection: PropTypes.shape({}).isRequired
}

export default ProjectCollectionContents
