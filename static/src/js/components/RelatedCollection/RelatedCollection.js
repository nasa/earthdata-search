import React from 'react'
import { PropTypes } from 'prop-types'

import { parse } from 'qs'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import { stringify } from '../../util/url/url'

export const RelatedCollection = ({
  className,
  location,
  onFocusedCollectionChange,
  onMetricsRelatedCollection,
  relatedCollection
}) => {
  const { id, title } = relatedCollection
  const params = parse(
    location.search,
    {
      ignoreQueryPrefix: true,
      parseArrays: false
    }
  )

  let { p = '' } = params
  p = p.replace(/^[^!]*/, id)

  return (
    <PortalLinkContainer
      className={className}
      type="link"
      onClick={() => {
        onMetricsRelatedCollection({
          collectionId: id,
          type: 'view'
        })
        onFocusedCollectionChange(id)
      }}
      to={{
        pathname: '/search/granules',
        search: stringify({
          ...params,
          p
        })
      }}
    >
      {title}
    </PortalLinkContainer>
  )
}

RelatedCollection.defaultProps = {
  className: ''
}

RelatedCollection.propTypes = {
  className: PropTypes.string,
  location: PropTypes.shape({
    search: PropTypes.string
  }).isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired,
  onMetricsRelatedCollection: PropTypes.func.isRequired,
  relatedCollection: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string
  }).isRequired
}

export default RelatedCollection
