import React from 'react'
import { PropTypes } from 'prop-types'
import { parse } from 'qs'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import { stringify } from '../../util/url/url'

import useEdscStore from '../../zustand/useEdscStore'

export const RelatedCollection = ({
  className,
  location,
  onMetricsRelatedCollection,
  relatedCollection
}) => {
  const changeFocusedCollection = useEdscStore(
    (state) => state.focusedCollection.changeFocusedCollection
  )

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
      onClick={
        () => {
          onMetricsRelatedCollection({
            collectionId: id,
            type: 'view'
          })

          changeFocusedCollection(id)
        }
      }
      to={
        {
          pathname: '/search/granules',
          search: stringify({
            ...params,
            p
          })
        }
      }
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
  onMetricsRelatedCollection: PropTypes.func.isRequired,
  relatedCollection: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string
  }).isRequired
}

export default RelatedCollection
