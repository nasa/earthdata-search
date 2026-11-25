import React from 'react'

// @ts-expect-error: Types do not exist for this file
import Banner from '../Banner/Banner'

import useEdscStore from '../../zustand/useEdscStore'

/**
 * Displays a dismissable banner when NLP (Enhanced) search is temporarily unavailable.
 * This is rendered in the AppLayout, above the SecondaryToolbar, so the banner is not
 * covered by the toolbar on pages where the toolbar overlays the page content.
 */
const NlpSearchUnavailableBanner = () => {
  const showNlpSearchUnavailableBanner = useEdscStore(
    (state) => state.home.showNlpSearchUnavailableBanner
  )
  const setShowNlpSearchUnavailableBanner = useEdscStore(
    (state) => state.home.setShowNlpSearchUnavailableBanner
  )

  if (!showNlpSearchUnavailableBanner) return null

  return (
    <Banner
      title="Enhanced Search is temporarily unavailable"
      message="Please try again using Traditional search"
      type="info"
      onClose={() => setShowNlpSearchUnavailableBanner(false)}
    />
  )
}

export default NlpSearchUnavailableBanner
