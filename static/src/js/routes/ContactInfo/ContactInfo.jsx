import React from 'react'
import { Helmet } from 'react-helmet'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

import ContactInfoContainer from '../../containers/ContactInfoContainer/ContactInfoContainer'
import { routes } from '../../constants/routes'

const { edscHost } = getEnvironmentConfig()

/**
 * The ContactInfo route component
*/
export const ContactInfo = () => (
  <>
    <Helmet>
      <title>Contact Information</title>
      <meta name="title" content="Contact Information" />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={`${edscHost}${routes.CONTACT_INFO}`} />
    </Helmet>
    <div className="route-wrapper route-wrapper--light route-wrapper--content-page">
      <div className="route-wrapper__content">
        <div className="route-wrapper__content-inner">
          <ContactInfoContainer />
        </div>
      </div>
    </div>
  </>
)

export default ContactInfo
