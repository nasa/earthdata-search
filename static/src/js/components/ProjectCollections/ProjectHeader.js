/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import abbreviate from 'number-abbreviate'

import { convertSizeToMB, convertSize } from '../../util/project'
import { commafy } from '../../util/commafy'
import { pluralize } from '../../util/pluralize'

import './ProjectHeader.scss'

/**
 * Renders ProjectHeader.
 * @param {object} props - The props passed into the component.
 * @param {object} props.collections - Collections passed from redux store.
 */

export class ProjectHeader extends Component {
  constructor() {
    super()
    this.component = this
  }

  render() {
    const { collections } = this.props
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
      <header className="project-header">
        <h2 className="project-header__title">Lorem Ipsum</h2>
        <ul className="project-header__stats-list">
          {!Number.isNaN(totalGranules) && (
            <>
              <li
                className="project-header__stats-item project-header__stats-item--granules"
              >
                <span className="project-header__stats-val">
                  {`${abbreviate(totalGranules, 1)} `}
                </span>
                {pluralize('Granule', totalGranules)}
              </li>
              <li
                className="project-header__stats-item project-header__stats-item--collections"
              >
                <span className="project-header__stats-val">
                  {`${commafy(projectIds.length)} `}
                </span>
                {pluralize('Collection', projectIds.length)}
              </li>
              <li
                className="project-header__stats-item project-header__stats-item--size"
              >
                <span className="project-header__stats-val">
                  {`${totalProjectSize} `}
                </span>
                {totalUnit}

                <OverlayTrigger
                  container={this.component}
                  placement="right"
                  overlay={(
                    <Tooltip
                      className="tooltip--large tooltip--ta-left tooltip--wide"
                    >
                      This is the estimated overall size of your project. If no size information exists in a granule&apos;s metadata,
                      it will not be included in this number. The size is estimated based upon the first 20 granules added to your
                      project from each collection.
                    </Tooltip>
                  )}
                >
                  <i className="fa fa-info-circle project-header__stats-icon" />
                </OverlayTrigger>
              </li>
            </>
          )}
        </ul>
      </header>
    )
  }
}

ProjectHeader.propTypes = {
  collections: PropTypes.shape({}).isRequired
}

export default ProjectHeader
