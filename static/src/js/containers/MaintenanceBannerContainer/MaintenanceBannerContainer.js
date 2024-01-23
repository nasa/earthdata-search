import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Banner } from '../../components/Banner/Banner'

export const MaintenanceBannerContainer = ({
  message
}) => {
  const [bannerDismissed, setBannerDismissed] = useState(false)
  if (bannerDismissed) return null

  const onClose = () => {
    setBannerDismissed(true)
  }

  return (
    (
      <Banner
        message={message}
        onClose={onClose}
        title="Earthdata Search Maintenance"
        type="maintenance"
      />
    )
  )
}

MaintenanceBannerContainer.propTypes = {
  message: PropTypes.string.isRequired

}

export default MaintenanceBannerContainer
