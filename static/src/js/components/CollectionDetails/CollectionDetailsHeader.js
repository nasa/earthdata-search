import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { Badge } from 'react-bootstrap'

import { MoreActionsDropdown } from '../MoreActionsDropdown/MoreActionsDropdown'

import './CollectionDetailsHeader.scss'
import generateHandoffs from '../../util/handoffs/generateHandoffs'

/**
 * Renders CollectionDetailsHeader.
 * @param {object} props - The props passed into the component.
 * @param {object} props.focusedCollectionMetadata - Focused collection passed from redux store.
 */
export const CollectionDetailsHeader = ({
  focusedCollectionMetadata,
  collectionSearch
}) => {
  const {
    short_name: shortName,
    title,
    version_id: versionId
  } = focusedCollectionMetadata

  if (isEmpty(focusedCollectionMetadata)) return null

  const handoffLinks = generateHandoffs(focusedCollectionMetadata, collectionSearch)

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
        <MoreActionsDropdown className="col-auto align-self-end" handoffLinks={handoffLinks} />
      </div>
    </div>
  )
}

CollectionDetailsHeader.defaultProps = {
  focusedCollectionMetadata: {}
}

CollectionDetailsHeader.propTypes = {
  focusedCollectionMetadata: PropTypes.shape({}),
  collectionSearch: PropTypes.shape({}).isRequired
}

export default CollectionDetailsHeader
