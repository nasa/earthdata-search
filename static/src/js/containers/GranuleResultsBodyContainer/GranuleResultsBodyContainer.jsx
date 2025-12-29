import React from 'react'
import PropTypes from 'prop-types'

import GranuleResultsBody from '../../components/GranuleResults/GranuleResultsBody'

import useEdscStore from '../../zustand/useEdscStore'
import { getFocusedCollectionGranuleQuery } from '../../zustand/selectors/query'
import { getCollectionId, getFocusedCollectionMetadata } from '../../zustand/selectors/collection'

export const GranuleResultsBodyContainer = ({
  panelView
}) => {
  const collectionMetadata = useEdscStore(getFocusedCollectionMetadata)
  const changeGranuleQuery = useEdscStore((state) => state.query.changeGranuleQuery)
  const granuleQuery = useEdscStore(getFocusedCollectionGranuleQuery)
  const focusedCollectionId = useEdscStore(getCollectionId)

  const {
    pageNum = 1
  } = granuleQuery

  const {
    isOpenSearch = false,
    directDistributionInformation = {}
  } = collectionMetadata

  const loadNextPage = () => {
    changeGranuleQuery({
      collectionId: focusedCollectionId,
      query: {
        pageNum: pageNum + 1
      }
    })
  }

  return (
    <GranuleResultsBody
      collectionId={focusedCollectionId}
      directDistributionInformation={directDistributionInformation}
      isOpenSearch={isOpenSearch}
      loadNextPage={loadNextPage}
      panelView={panelView}
    />
  )
}

GranuleResultsBodyContainer.propTypes = {
  panelView: PropTypes.string.isRequired
}

export default GranuleResultsBodyContainer
