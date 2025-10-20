import React from 'react'
import { useLocation } from 'react-router-dom'
import { FaMap } from 'react-icons/fa'
import { min } from 'lodash-es'

import { commafy } from '../../util/commafy'
import { granuleListItem, granuleListTotal } from './skeleton'
import { pluralize } from '../../util/pluralize'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Skeleton from '../Skeleton/Skeleton'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './GranuleResultsHighlights.scss'
import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionId, getFocusedCollectionMetadata } from '../../zustand/selectors/collection'
import { getCollectionsQuery } from '../../zustand/selectors/query'
import { getGranuleIds } from '../../util/getGranuleIds'
import { getGranules } from '../../zustand/selectors/granules'
import { routes } from '../../constants/routes'

const granuleListItemSkeletonStyle = {
  height: '99px'
}

const granuleListTotalStyle = {
  height: '18px'
}

const GranuleResultsHighlights = () => {
  const location = useLocation()
  const collectionMetadata = useEdscStore(getFocusedCollectionMetadata)
  const {
    isOpenSearch
  } = collectionMetadata

  const focusedCollectionId = useEdscStore(getCollectionId)
  const collectionsQuery = useEdscStore(getCollectionsQuery)
  const granules = useEdscStore(getGranules)

  const { [focusedCollectionId]: collectionQueryResults = {} } = collectionsQuery
  const { granules: collectionGranuleQuery = {} } = collectionQueryResults
  const { excludedGranuleIds = [] } = collectionGranuleQuery

  const {
    items = [],
    count,
    isLoading = false,
    isLoaded = false
  } = granules

  // Limit the number of granules shown
  const limit = min([5, count])

  const allIds = items.map((granule) => granule.id)
  const granuleIds = getGranuleIds({
    allIds,
    excludedGranuleIds,
    isOpenSearch,
    limit
  })

  const granuleList = granuleIds.map((granuleId) => (
    granules.items.find((granule) => granule.id === granuleId)
  ))

  const visibleGranules = granuleIds.length ? granuleIds.length : 0
  const granuleCount = count - excludedGranuleIds.length

  return (
    <div className="granule-results-highlights">
      <div className="granule-results-highlights__count">
        {
          (isLoading) && (
            <Skeleton
              shapes={granuleListTotal}
              containerStyle={granuleListTotalStyle}
              variant="dark"
            />
          )
        }
        {
          (isLoaded && !isLoading) && (
            `Showing ${commafy(visibleGranules)} of ${commafy(
              granuleCount
            )} matching ${pluralize('granule', granuleCount)}`
          )
        }
      </div>
      <ul className="granule-results-highlights__list">
        {
          !isLoaded && (
            <>
              {
                Array.from({ length: 3 }).map((item, index) => {
                  const key = `granule_loader_${index}`

                  return (
                    <Skeleton
                      key={key}
                      className="granule-results-highlights__item"
                      containerStyle={granuleListItemSkeletonStyle}
                      shapes={granuleListItem}
                      variant="dark"
                    />
                  )
                })
              }
            </>
          )
        }
        {
          (isLoaded && !isLoading) && (
            granuleCount > 0
              ? (
                granuleList.map((granule, i) => {
                  const {
                    id,
                    title,
                    formattedTemporal = ['Not Provided', 'Not Provided']
                  } = granule

                  const [
                    timeStart,
                    timeEnd
                  ] = formattedTemporal

                  const key = `${id}_${i}`

                  return (
                    <li key={key} className="granule-results-highlights__item">
                      <header className="granule-results-highlights__item-header">
                        <h4 className="granule-results-highlights__item-title">{title}</h4>
                      </header>
                      <div className="granule-results-highlights__item-body">
                        <div className="granule-results-highlights__temporal-row granule-results-highlights__temporal-row--start">
                          <h5 className="granule-results-highlights__temporal-label">
                            Start
                          </h5>
                          <p className="granule-results-highlights__temporal-value">{timeStart || <>&ndash;</>}</p>
                        </div>
                        <div className="granule-results-highlights__temporal-row granule-results-highlights__temporal-row--end">
                          <h5 className="granule-results-highlights__temporal-label">
                            End
                          </h5>
                          <p className="granule-results-highlights__temporal-value">{timeEnd || <>&ndash;</>}</p>
                        </div>
                      </div>
                    </li>
                  )
                })
              ) : (
                <li className="granule-results-highlights__empty">
                  No Granules
                </li>
              )
          )
        }
      </ul>
      {
        granuleCount > 0 && (
          <div className="granule-results-highlights__footer">
            <PortalLinkContainer
              className="granule-results-header__title-link granule-results-header__title-link-icon"
              to={
                {
                  pathname: routes.GRANULES,
                  search: location.search
                }
              }
            >
              <EDSCIcon icon={FaMap} inlineFlex={false} />
              {' View Granules'}
            </PortalLinkContainer>
          </div>
        )
      }
    </div>
  )
}

export default GranuleResultsHighlights
