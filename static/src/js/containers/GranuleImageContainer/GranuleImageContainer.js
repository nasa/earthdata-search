import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'
import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getFocusedGranuleMetadata } from '../../selectors/granuleMetadata'

import GranuleImage from '../../components/GranuleImage/GranuleImage'

export const mapStateToProps = (state) => ({
  earthdataEnvironment: getEarthdataEnvironment(state),
  focusedGranuleId: getFocusedGranuleId(state),
  granuleMetadata: getFocusedGranuleMetadata(state)
})

export const GranuleImageContainer = ({
  earthdataEnvironment,
  focusedGranuleId,
  granuleMetadata
}) => {
  const { browseFlag } = granuleMetadata

  let imageSrc = ''

  if (browseFlag) {
    imageSrc = `${getEarthdataConfig(earthdataEnvironment).cmrHost}/browse-scaler/browse_images/granules/${focusedGranuleId}?h=512&w=512`
  }

  return (
    <GranuleImage imageSrc={imageSrc} />
  )
}

GranuleImageContainer.propTypes = {
  earthdataEnvironment: PropTypes.string.isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  granuleMetadata: PropTypes.shape({
    browseFlag: PropTypes.bool
  }).isRequired
}

export default connect(mapStateToProps, null)(GranuleImageContainer)
