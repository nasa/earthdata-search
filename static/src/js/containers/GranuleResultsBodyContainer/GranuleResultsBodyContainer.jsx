import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { locationPropType } from '../../util/propTypes/location'
import actions from '../../actions/index'

import { metricsAddGranuleProject, metricsDataAccess } from '../../middleware/metrics/actions'

import { getFocusedCollectionGranuleResults } from '../../selectors/collectionResults'
import {
  getFocusedCollectionMetadata,
  getFocusedCollectionTags
} from '../../selectors/collectionMetadata'
import { getGranulesMetadata } from '../../selectors/granuleMetadata'

import GranuleResultsBody from '../../components/GranuleResults/GranuleResultsBody'

import useEdscStore from '../../zustand/useEdscStore'
import { getFocusedCollectionGranuleQuery } from '../../zustand/selectors/query'
import { getCollectionId } from '../../zustand/selectors/collection'

export const mapDispatchToProps = (dispatch) => ({
  onGenerateNotebook:
    (data) => dispatch(actions.generateNotebook(data)),
  onMetricsAddGranuleProject:
      (data) => dispatch(metricsAddGranuleProject(data)),
  onMetricsDataAccess:
    (data) => dispatch(metricsDataAccess(data))
})

export const mapStateToProps = (state) => ({
  collectionMetadata: getFocusedCollectionMetadata(state),
  collectionTags: getFocusedCollectionTags(state),
  generateNotebook: state.ui.generateNotebook,
  granuleSearchResults: getFocusedCollectionGranuleResults(state),
  granulesMetadata: getGranulesMetadata(state)
})

export const GranuleResultsBodyContainer = (props) => {
  const {
    collectionMetadata,
    collectionTags,
    generateNotebook,
    granuleSearchResults,
    granulesMetadata,
    location,
    onGenerateNotebook,
    onMetricsAddGranuleProject,
    onMetricsDataAccess,
    panelView
  } = props

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
      collectionTags={collectionTags}
      directDistributionInformation={directDistributionInformation}
      generateNotebook={generateNotebook}
      granuleSearchResults={granuleSearchResults}
      granulesMetadata={granulesMetadata}
      isOpenSearch={isOpenSearch}
      loadNextPage={loadNextPage}
      location={location}
      onGenerateNotebook={onGenerateNotebook}
      onMetricsDataAccess={onMetricsDataAccess}
      onMetricsAddGranuleProject={onMetricsAddGranuleProject}
      panelView={panelView}
    />
  )
}

GranuleResultsBodyContainer.propTypes = {
  collectionMetadata: PropTypes.shape({
    directDistributionInformation: PropTypes.shape({}),
    isOpenSearch: PropTypes.bool
  }).isRequired,
  collectionTags: PropTypes.shape({}).isRequired,
  generateNotebook: PropTypes.shape({}).isRequired,
  granuleSearchResults: PropTypes.shape({}).isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  onGenerateNotebook: PropTypes.func.isRequired,
  onMetricsAddGranuleProject: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsBodyContainer)
)
