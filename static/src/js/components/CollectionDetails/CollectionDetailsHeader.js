import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'

import Skeleton from '../Skeleton/Skeleton'
import { MoreActionsDropdown } from '../MoreActionsDropdown/MoreActionsDropdown'

import { collectionTitleSkeleton } from './skeleton'
import generateHandoffs from '../../util/handoffs/generateHandoffs'

import './CollectionDetailsHeader.scss'

/**
 * Renders CollectionDetailsHeader.
 * @param {object} props - The props passed into the component.
 * @param {object} props.focusedCollectionMetadata - Focused collection passed from redux store.
 */
export const CollectionDetailsHeader = ({
  focusedCollectionMetadata,
  collectionSearch,
  mapProjection
}) => {
  const {
    short_name: shortName,
    title,
    version_id: versionId
  } = focusedCollectionMetadata

  const handoffLinks = generateHandoffs(focusedCollectionMetadata, collectionSearch, mapProjection)

  return (
    <div className="collection-details-header">
      <div className="row">
        <div className="col align-self-start">
          <div className="collection-details-header__title-wrap">
            {
              !title && (
                <Skeleton
                  className="order-status__item-skeleton"
                  containerStyle={{ display: 'inline-block', height: '1.375rem', width: '100%' }}
                  shapes={collectionTitleSkeleton}
                />
              )
            }
            {
              title && (
                <>
                  <h2 className="collection-details-header__title">{title}</h2>
                  <Badge className="collection-details-header__short-name" variant="light">{shortName}</Badge>
                  <Badge className="collection-details-header__version-id" variant="info">{`Version ${versionId}`}</Badge>
                </>
              )
            }
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
  collectionSearch: PropTypes.shape({}).isRequired,
  mapProjection: PropTypes.string.isRequired
}

export default CollectionDetailsHeader
