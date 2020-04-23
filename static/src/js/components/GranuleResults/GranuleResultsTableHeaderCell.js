/* eslint-disable no-unused-vars */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from '../Button/Button'
import GranuleResultsDataLinksButton from './GranuleResultsDataLinksButton'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import murmurhash3 from '../../util/murmurhash3'

const GranuleResultsTableHeaderCell = (props) => {
  const { column, cell, row } = props
  const { customProps } = column
  const { original: rowProps } = row
  const {
    id,
    isCwic,
    dataLinks,
    onlineAccessFlag,
    isFocusedGranule,
    handleClick
  } = rowProps

  const {
    collectionId,
    location,
    onExcludeGranule,
    onFocusedGranuleChange,
    onMetricsDataAccess
  } = customProps

  const { value } = cell

  const handleRemoveClick = (id) => {
    let granuleId = id

    if (isCwic) granuleId = murmurhash3(id).toString()
    onExcludeGranule({
      collectionId,
      granuleId
    })
  }

  return (
    <>
      <Button
        className="granule-results-table__title-button"
        variant="naked"
        label={value}
        title={value}
        onClick={handleClick}
      >
        <h4 className="granule-results-table__granule-name">
          {value}
        </h4>
      </Button>
      <div className="granule-results-table__granule-actions">
        <PortalLinkContainer
          className="button granule-results-table__granule-action granule-results-table__granule-action--info"
          type="button"
          label="View granule details"
          title="View granule details"
          onClick={() => onFocusedGranuleChange(id)}
          to={{
            pathname: '/search/granules/granule-details',
            search: location.search
          }}
        >
          <i className="fa fa-info-circle" />
        </PortalLinkContainer>
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
        <Button
          className="granule-results-table__granule-action granule-results-table__granule-action--info"
          icon="times"
          variant="naked"
          label="Remove granule"
          title="Remove granule"
          onClick={(e) => {
            handleRemoveClick(id)
            e.stopPropagation()
          }}
        />
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
