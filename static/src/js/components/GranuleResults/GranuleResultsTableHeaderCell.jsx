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
import { getValueForTag } from '../../../../../sharedUtils/tags'

import GranuleResultsDataLinksButton from './GranuleResultsDataLinksButton'
import Button from '../Button/Button'
import MoreActionsDropdown from '../MoreActionsDropdown/MoreActionsDropdown'
import MoreActionsDropdownItem from '../MoreActionsDropdown/MoreActionsDropdownItem'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'
import GranuleResultsDownloadNotebookButton from './GranuleResultsDownloadNotebookButton'

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
    collectionQuerySpatial,
    collectionTags,
    directDistributionInformation,
    generateNotebook,
    isGranuleInProject,
    location,
    onAddGranuleToProjectCollection,
    onExcludeGranule,
    onFocusedGranuleChange,
    onGenerateNotebook,
    onMetricsAddGranuleProject,
    onMetricsDataAccess,
    onRemoveGranuleFromProjectCollection
  } = customProps

  const generateNotebookTag = getValueForTag('notebook_generation', collectionTags)

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
                  ariaLabel="Add granule to project"
                  tooltip="Add granule to project"
                  tooltipId={`add-granule-table-tooltip-${id}`}
                  icon={Plus}
                  iconSize="12"
                  onClick={
                    (event) => {
                      onAddGranuleToProjectCollection({
                        collectionId,
                        granuleId: id
                      })

                      onMetricsAddGranuleProject({
                        collectionConceptId: collectionId,
                        granuleConceptId: id,
                        page: 'granules',
                        view: 'table'
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
                  ariaLabel="Remove granule from project"
                  tooltip="Remove granule from project"
                  tooltipId={`remove-granule-table-tooltip-${id}`}
                  icon={Minus}
                  iconSize="12"
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
              buttonVariant="naked"
              collectionId={collectionId}
              directDistributionInformation={directDistributionInformation}
              dataLinks={dataLinks}
              id={id}
              s3Links={s3Links}
              onMetricsDataAccess={onMetricsDataAccess}
            />
          )
        }
        {
          generateNotebookTag && (
            <GranuleResultsDownloadNotebookButton
              collectionQuerySpatial={collectionQuerySpatial}
              granuleId={id}
              generateNotebook={generateNotebook}
              generateNotebookTag={generateNotebookTag}
              onGenerateNotebook={onGenerateNotebook}
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
      collectionQuerySpatial: PropTypes.shape({}).isRequired,
      collectionTags: PropTypes.shape({}).isRequired,
      directDistributionInformation: PropTypes.shape({}),
      generateNotebook: PropTypes.shape({}).isRequired,
      isGranuleInProject: PropTypes.func,
      location: PropTypes.shape({
        search: PropTypes.string
      }),
      onAddGranuleToProjectCollection: PropTypes.func,
      onExcludeGranule: PropTypes.func,
      onFocusedGranuleChange: PropTypes.func,
      onGenerateNotebook: PropTypes.func.isRequired,
      onMetricsAddGranuleProject: PropTypes.func,
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
