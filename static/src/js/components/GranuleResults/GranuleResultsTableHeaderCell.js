import React from 'react'
import PropTypes from 'prop-types'
import { LinkContainer } from 'react-router-bootstrap'
import {
  FaPlus,
  FaMinus,
  FaInfoCircle,
  FaTimesCircle
} from 'react-icons/fa'

import murmurhash3 from '../../util/murmurhash3'
import { portalPath } from '../../../../../sharedUtils/portalPath'

import GranuleResultsDataLinksButton from './GranuleResultsDataLinksButton'
import Button from '../Button/Button'
import MoreActionsDropdown from '../MoreActionsDropdown/MoreActionsDropdown'
import MoreActionsDropdownItem from '../MoreActionsDropdown/MoreActionsDropdownItem'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'

const GranuleResultsTableHeaderCell = (props) => {
  const { column, cell, row } = props
  const { customProps } = column
  const { original: rowProps } = row
  const {
    s3Links,
    dataLinks,
    id,
    isOpenSearch,
    onlineAccessFlag
  } = rowProps

  const {
    collectionId,
    directDistributionInformation,
    isGranuleInProject,
    location,
    onAddGranuleToProjectCollection,
    onExcludeGranule,
    onFocusedGranuleChange,
    onMetricsDataAccess,
    onRemoveGranuleFromProjectCollection,
    portal
  } = customProps

  const isInProject = isGranuleInProject(id)

  const { value } = cell

  const handleFilterClick = (id) => {
    let granuleId = id

    if (isOpenSearch) granuleId = murmurhash3(id).toString()

    onExcludeGranule({
      collectionId,
      granuleId
    })
  }

  return (
    <>
      <h4
        className="granule-results-table__granule-name"
        title={value}
      >
        {value}
      </h4>
      <div className="granule-results-table__granule-actions">
        <PortalFeatureContainer authentication>
          <>
            {
              !isInProject
                ? (
                  <Button
                    className="button granule-results-table__granule-action granule-results-table__granule-action--add"
                    type="button"
                    label="Add granule"
                    title="Add granule"
                    icon={FaPlus}
                    iconSize="0.75rem"
                    onClick={(e) => {
                      onAddGranuleToProjectCollection({
                        collectionId,
                        granuleId: id
                      })

                      // Prevent event bubbling up to the granule focus event.
                      e.stopPropagation()
                    }}
                  />
                )
                : (
                  <Button
                    className="button granule-results-table__granule-action granule-results-table__granule-action--remove"
                    type="button"
                    label="Remove granule"
                    title="Remove granule"
                    icon={FaMinus}
                    iconSize="0.75rem"
                    onClick={(e) => {
                      onRemoveGranuleFromProjectCollection({
                        collectionId,
                        granuleId: id
                      })

                      // Prevent event bubbling up to the granule focus event.
                      e.stopPropagation()
                    }}
                  />
                )
            }
          </>
        </PortalFeatureContainer>
        {
          onlineAccessFlag && (
            <GranuleResultsDataLinksButton
              collectionId={collectionId}
              directDistributionInformation={directDistributionInformation}
              dataLinks={dataLinks}
              s3Links={s3Links}
              onMetricsDataAccess={onMetricsDataAccess}
              buttonVariant="naked"
            />
          )
        }
        <MoreActionsDropdown
          className="granule-results-table__granule-action granule-results-table__more-actions-dropdown"
        >
          <LinkContainer
            onClick={() => {
              onFocusedGranuleChange(id)
            }}
            to={{
              pathname: `${portalPath(portal)}/search/granules/granule-details`,
              search: location.search
            }}
          >
            <MoreActionsDropdownItem
              title="View details"
              icon={FaInfoCircle}
            />
          </LinkContainer>
          <MoreActionsDropdownItem
            title="Filter granule"
            icon={FaTimesCircle}
            onClick={(e) => {
              handleFilterClick(id)
              e.stopPropagation()
            }}
          />
        </MoreActionsDropdown>
      </div>
    </>
  )
}

GranuleResultsTableHeaderCell.propTypes = {
  cell: PropTypes.shape({
    value: PropTypes.string
  }).isRequired,
  column: PropTypes.shape({
    customProps: PropTypes.shape({
      collectionId: PropTypes.string,
      directDistributionInformation: PropTypes.shape({}),
      isGranuleInProject: PropTypes.bool,
      location: PropTypes.shape({
        search: PropTypes.string
      }),
      onAddGranuleToProjectCollection: PropTypes.func,
      onExcludeGranule: PropTypes.func,
      onFocusedGranuleChange: PropTypes.func,
      onMetricsDataAccess: PropTypes.func,
      onRemoveGranuleFromProjectCollection: PropTypes.func,
      portal: PropTypes.shape({})
    })
  }).isRequired,
  row: PropTypes.shape({
    original: PropTypes.shape({})
  }).isRequired
}

export default GranuleResultsTableHeaderCell
