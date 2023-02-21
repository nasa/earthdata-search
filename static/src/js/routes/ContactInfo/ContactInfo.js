import React from 'react'
import { Helmet } from 'react-helmet'

import { withRouter } from 'react-router-dom'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

import ContactInfoContainer from '../../containers/ContactInfoContainer/ContactInfoContainer'

const { edscHost } = getEnvironmentConfig()

export const ContactInfo = () => (
  <>
    <Helmet>
      <title>Contact Information</title>
      <meta name="title" content="Contact Information" />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={`${edscHost}/contact-info`} />
    </Helmet>
    <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
      <div className="route-wrapper__content">
        <div className="route-wrapper__content-inner">
          <ContactInfoContainer />
        </div>
      </div>
    </div>
  </>
)

ContactInfo.propTypes = {}

export default withRouter(ContactInfo)
