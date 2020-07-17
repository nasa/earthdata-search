import React from 'react'
import PropTypes from 'prop-types'
import { LinkContainer } from 'react-router-bootstrap'

import murmurhash3 from '../../util/murmurhash3'
import { portalPath } from '../../../../../sharedUtils/portalPath'

import GranuleResultsDataLinksButton from './GranuleResultsDataLinksButton'
import Button from '../Button/Button'
import MoreActionsDropdown from '../MoreActionsDropdown/MoreActionsDropdown'
import MoreActionsDropdownItem from '../MoreActionsDropdown/MoreActionsDropdownItem'
import { authenticationEnabled } from '../../util/portals'


const GranuleResultsTableHeaderCell = (props) => {
  const { column, cell, row } = props
  const { customProps } = column
  const { original: rowProps } = row
  const {
    dataLinks,
    id,
    isCwic,
    onlineAccessFlag
  } = rowProps

  const {
    collectionId,
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

    if (isCwic) granuleId = murmurhash3(id).toString()
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
        {
          authenticationEnabled(portal) && (
            <>
              {
                !isInProject
                  ? (
                    <Button
                      className="button granule-results-table__granule-action granule-results-table__granule-action--add"
                      type="button"
                      label="Add granule"
                      title="Add granule"
                      onClick={(e) => {
                        onAddGranuleToProjectCollection({
                          collectionId,
                          granuleId: id
                        })

                        // Prevent event bubbling up to the granule focus event.
                        e.stopPropagation()
                      }}
                    >
                      <i className="fa fa-plus" />
                    </Button>
                  )
                  : (
                    <Button
                      className="button granule-results-table__granule-action granule-results-table__granule-action--remove"
                      type="button"
                      label="Remove granule"
                      title="Remove granule"
                      onClick={(e) => {
                        onRemoveGranuleFromProjectCollection({
                          collectionId,
                          granuleId: id
                        })

                        // Prevent event bubbling up to the granule focus event.
                        e.stopPropagation()
                      }}
                    >
                      <i className="fa fa-minus" />
                    </Button>
                  )
              }
            </>
          )
        }
        {
          onlineAccessFlag && (
            <GranuleResultsDataLinksButton
              collectionId={collectionId}
              dataLinks={dataLinks}
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
              icon="info-circle"
            />
          </LinkContainer>
          <MoreActionsDropdownItem
            title="Filter granule"
            icon="times-circle"
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
  column: PropTypes.shape({}).isRequired,
  cell: PropTypes.shape({}).isRequired,
  row: PropTypes.shape({}).isRequired
}

export default GranuleResultsTableHeaderCell
