import React from 'react'

import { withRouter } from 'react-router-dom'

import ContactInfoContainer from '../../containers/ContactInfoContainer/ContactInfoContainer'

export const ContactInfo = () => (
  <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
    <div className="route-wrapper__content">
      <div className="route-wrapper__content-inner">
        <ContactInfoContainer />
      </div>
    </div>
  </div>
)

ContactInfo.propTypes = {}

export default withRouter(ContactInfo)
