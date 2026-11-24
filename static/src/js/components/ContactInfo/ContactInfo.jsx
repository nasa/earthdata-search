import React from 'react'

import { ArrowLineDiagonal } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { getEarthdataConfig } from '../../../../../sharedUtils/config'

import Button from '../Button/Button'

import useEdscStore from '../../zustand/useEdscStore'
import { getUrsProfile } from '../../zustand/selectors/user'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'

import './ContactInfo.scss'

const ContactInfo = () => {
  const ursProfile = useEdscStore(getUrsProfile)

  const {
    affiliation,
    country,
    emailAddress,
    firstName,
    lastName,
    organization,
    studyArea,
    userType
  } = ursProfile

  const earthdataEnvironment = useEdscStore(getEarthdataEnvironment)
  const { edlHost } = getEarthdataConfig(earthdataEnvironment)

  return (
    <fieldset className="contact-info-form">
      <legend>
        <h2 className="route-wrapper__page-heading">Contact Information</h2>
      </legend>
      <ul className="contact-info-form__list">
        <li className="contact-info-form__item">
          <span className="contact-info-form__label">First Name</span>
          <span>{firstName}</span>
        </li>
        <li className="contact-info-form__item">
          <span className="contact-info-form__label">Last Name</span>
          <span>{lastName}</span>
        </li>
        <li className="contact-info-form__item">
          <span className="contact-info-form__label">Email</span>
          <span>{emailAddress}</span>
        </li>
        <li className="contact-info-form__item">
          <span className="contact-info-form__label">Organization Name</span>
          <span>{organization}</span>
        </li>
        <li className="contact-info-form__item">
          <span className="contact-info-form__label">Country</span>
          <span>{country}</span>
        </li>
        <li className="contact-info-form__item">
          <span className="contact-info-form__label">Affiliation</span>
          <span>{affiliation}</span>
        </li>
        <li className="contact-info-form__item">
          <span className="contact-info-form__label">Study Area</span>
          <span>{studyArea}</span>
        </li>
        <li className="contact-info-form__item">
          <span className="contact-info-form__label">User Type</span>
          <span>{userType}</span>
        </li>
      </ul>

      <div>
        <Button
          bootstrapVariant="primary"
          href={`${edlHost}/profile/edit`}
          label="Edit Profile in Earthdata Login"
          target="_blank"
          icon={ArrowLineDiagonal}
          iconPosition="right"
        >
          Edit Profile in Earthdata Login
        </Button>
      </div>
    </fieldset>
  )
}

export default ContactInfo
