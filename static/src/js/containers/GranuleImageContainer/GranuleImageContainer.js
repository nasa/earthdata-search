import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'
import getFocusedGranuleObject from '../../util/focusedGranule'

import GranuleImage from '../../components/GranuleImage/GranuleImage'

const mapStateToProps = state => ({
  focusedGranule: state.focusedGranule,
  granulesResults: state.searchResults.granules
})

export const GranuleImageContainer = ({
  focusedGranule,
  granulesResults
}) => {
  const focusedGranuleResult = getFocusedGranuleObject(focusedGranule, granulesResults)

  let imageSrc = ''

  if (focusedGranuleResult && focusedGranuleResult.browse_flag) {
    imageSrc = `${getEarthdataConfig(cmrEnv()).cmrHost}/browse-scaler/browse_images/granules/${focusedGranule}?h=512&w=512`
  }

  return (
    <GranuleImage imageSrc={imageSrc} />
  )
}

GranuleImageContainer.propTypes = {
  granulesResults: PropTypes.shape({}).isRequired,
  focusedGranule: PropTypes.string.isRequired
}

export default connect(mapStateToProps, null)(GranuleImageContainer)
