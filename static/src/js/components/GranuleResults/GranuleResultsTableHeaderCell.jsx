import React from 'react'
import PropTypes from 'prop-types'
import { LinkContainer } from 'react-router-bootstrap'
import {
  Plus,
  Minus,
  XCircled
} from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { AlertInformation } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'

import murmurhash3 from '../../util/murmurhash3'

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
    onRemoveGranuleFromProjectCollection
  } = customProps

  const isInProject = isGranuleInProject(id)

  const { value } = cell

  const handleFilterClick = (newGranuleId) => {
    let granuleId = newGranuleId

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
          {
            !isInProject
              ? (
                <Button
                  className="button granule-results-table__granule-action granule-results-table__granule-action--add"
                  type="button"
                  label="Add granule"
                  title="Add granule"
                  icon={Plus}
                  iconSize="0.75rem"
                  onClick={
                    (event) => {
                      onAddGranuleToProjectCollection({
                        collectionId,
                        granuleId: id
                      })

                      // Prevent event bubbling up to the granule focus event.
                      event.stopPropagation()
                    }
                  }
                />
              )
              : (
                <Button
                  className="button granule-results-table__granule-action granule-results-table__granule-action--remove"
                  type="button"
                  label="Remove granule"
                  title="Remove granule"
                  icon={Minus}
                  iconSize="0.75rem"
                  onClick={
                    (event) => {
                      onRemoveGranuleFromProjectCollection({
                        collectionId,
                        granuleId: id
                      })

                      // Prevent event bubbling up to the granule focus event.
                      event.stopPropagation()
                    }
                  }
                />
              )
          }
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
            onClick={
              () => {
                onFocusedGranuleChange(id)
              }
            }
            to={
              {
                pathname: '/search/granules/granule-details',
                search: location.search
              }
            }
          >
            <MoreActionsDropdownItem
              title="View details"
              icon={AlertInformation}
            />
          </LinkContainer>
          <MoreActionsDropdownItem
            title="Filter granule"
            icon={XCircled}
            onClick={
              (event) => {
                handleFilterClick(id)
                event.stopPropagation()
              }
            }
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
      isGranuleInProject: PropTypes.func,
      location: PropTypes.shape({
        search: PropTypes.string
      }),
      onAddGranuleToProjectCollection: PropTypes.func,
      onExcludeGranule: PropTypes.func,
      onFocusedGranuleChange: PropTypes.func,
      onMetricsDataAccess: PropTypes.func,
      onRemoveGranuleFromProjectCollection: PropTypes.func
    })
  }).isRequired,
  row: PropTypes.shape({
    original: PropTypes.shape({
      s3Links: PropTypes.arrayOf(PropTypes.shape({})),
      dataLinks: PropTypes.arrayOf(PropTypes.shape({})),
      id: PropTypes.string,
      isOpenSearch: PropTypes.bool,
      onlineAccessFlag: PropTypes.bool
    })
  }).isRequired
}

export default GranuleResultsTableHeaderCell
