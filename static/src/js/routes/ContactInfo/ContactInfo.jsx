import React from 'react'
import { Helmet } from 'react-helmet'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

import { routes } from '../../constants/routes'

import ContactInfoComponent from '../../components/ContactInfo/ContactInfo'

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
          <ContactInfoComponent />
        </div>
      </div>
    </div>
  </>
)

export default ContactInfo
