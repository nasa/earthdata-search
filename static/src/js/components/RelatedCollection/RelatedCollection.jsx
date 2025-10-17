import React from 'react'
import { useLocation } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { parse } from 'qs'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import { stringify } from '../../util/url/url'

import useEdscStore from '../../zustand/useEdscStore'
import { routes } from '../../constants/routes'

export const RelatedCollection = ({
  className = '',
  onMetricsRelatedCollection,
  relatedCollection
}) => {
  const location = useLocation()
  const setCollectionId = useEdscStore(
    (state) => state.collection.setCollectionId
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

          setCollectionId(id)
        }
      }
      to={
        {
          pathname: routes.GRANULES,
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

RelatedCollection.propTypes = {
  className: PropTypes.string,
  onMetricsRelatedCollection: PropTypes.func.isRequired,
  relatedCollection: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string
  }).isRequired
}

export default RelatedCollection
