import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Dropdown } from 'react-bootstrap'

import ToggleMoreActions from '../CustomToggle/MoreActionsToggle'

import './CollectionDetailsHeader.scss'

/**
 * Renders CollectionDetailsHeader.
 * @param {object} props - The props passed into the component.
 * @param {object} props.focusedCollectionMetadata - Focused collection passed from redux store.
 */
export const CollectionDetailsHeader = ({ focusedCollectionMetadata }) => {
  const [collectionId = ''] = Object.keys(focusedCollectionMetadata)
  const { metadata } = focusedCollectionMetadata[collectionId]
  const { short_name: shortName, title, version_id: versionId } = metadata

  if (!Object.keys(metadata).length) return null

  return (
    <div className="collection-details-header">
      <div className="row">
        <div className="col align-self-start">
          <div className="collection-details-header__title-wrap">
            {
              title && (
                <h2 className="collection-details-header__title">{title}</h2>
              )
            }
            <Badge className="collection-details-header__short-name" variant="light">{shortName}</Badge>
            <Badge className="collection-details-header__version-id" variant="info">{`Version ${versionId}`}</Badge>
          </div>
        </div>
        <div className="col-auto align-self-end">
          <Dropdown className="collection-details-header__more-actions">
            <Dropdown.Toggle
              className="collection-details-header__more-actions-toggle"
              as={ToggleMoreActions}
            />
            <Dropdown.Menu
              className="collection-details-header__more-actions-menu"
              alignRight
            >
              <Dropdown.Item
                className="collection-details-header__more-actions-item collection-details-header__more-actions-vis"
              >
                Giovanni Links
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}

CollectionDetailsHeader.propTypes = {
  focusedCollectionMetadata: PropTypes.shape({}).isRequired
}

export default CollectionDetailsHeader
