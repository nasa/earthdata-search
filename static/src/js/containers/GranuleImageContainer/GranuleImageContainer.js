import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'

import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getFocusedGranuleMetadata } from '../../selectors/granuleMetadata'

import GranuleImage from '../../components/GranuleImage/GranuleImage'

const mapStateToProps = state => ({
  focusedGranuleId: getFocusedGranuleId(state),
  granuleMetadata: getFocusedGranuleMetadata(state)
})

export const GranuleImageContainer = ({
  focusedGranuleId,
  granuleMetadata
}) => {
  const { browseFlag } = granuleMetadata

  let imageSrc = ''

  if (browseFlag) {
    imageSrc = `${getEarthdataConfig(cmrEnv()).cmrHost}/browse-scaler/browse_images/granules/${focusedGranuleId}?h=512&w=512`
  }

  return (
    <GranuleImage imageSrc={imageSrc} />
  )
}

GranuleImageContainer.propTypes = {
  focusedGranuleId: PropTypes.string.isRequired,
  granuleMetadata: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, null)(GranuleImageContainer)
