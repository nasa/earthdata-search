import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { ArrowLineDiagonal } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { isEmpty } from 'lodash-es'

import { getEarthdataConfig } from '../../../../../sharedUtils/config'

import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'

import './ContactInfo.scss'

const ContactInfo = ({
  contactInfo,
  onUpdateNotificationLevel
}) => {
  const {
    cmrPreferences = {},
    ursProfile
  } = contactInfo
  const {
    notificationLevel: propsNotificationLevel
  } = cmrPreferences

  const emptyPreferences = isEmpty(cmrPreferences)

  const earthdataEnvironment = useEdscStore(getEarthdataEnvironment)
  const { edlHost } = getEarthdataConfig(earthdataEnvironment)

  const [notificationLevel, setNotificationLevel] = useState(propsNotificationLevel || 'VERBOSE')

  useEffect(() => {
    if (propsNotificationLevel) setNotificationLevel(propsNotificationLevel)
  }, [propsNotificationLevel])

  const handleNotificationLevelChange = (event) => {
    setNotificationLevel(event.target.value)
  }

  const handleUpdateNotificationClick = () => {
    onUpdateNotificationLevel(notificationLevel)
  }

  const {
    affiliation,
    country,
    email_address: email,
    first_name: firstName,
    last_name: lastName,
    organization,
    study_area: studyArea,
    user_type: userType
  } = ursProfile

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
          <span>{email}</span>
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

      <hr />

      <h3>Update Notification Preference Level</h3>

      <div className="mb-2">
        <label htmlFor="notificationLevel">
          Receive delayed access notifications
        </label>
        {' '}
        {
          emptyPreferences
            ? (
              <Spinner className="contact-info-form__preferences-spinner" size="x-tiny" type="dots" inline />
            )
            : (
              <select
                id="notificationLevel"
                onChange={handleNotificationLevelChange}
                value={notificationLevel}
              >
                <option value="VERBOSE">Always</option>
                <option value="DETAIL">When requests change state</option>
                <option value="INFO">When requests reach a completed or failed state</option>
                <option value="CRITICAL">When requests fail</option>
                <option value="NONE">Never</option>
              </select>
            )
        }
      </div>

      <Button
        className="contact-info-form__update-notification-level"
        type="button"
        bootstrapVariant="primary"
        label="Update Notification Preference"
        onClick={handleUpdateNotificationClick}
        disabled={emptyPreferences}
      >
        Update Notification Preference
      </Button>

    </fieldset>
  )
}

ContactInfo.propTypes = {
  contactInfo: PropTypes.shape({
    cmrPreferences: PropTypes.shape({}),
    ursProfile: PropTypes.shape({
      affiliation: PropTypes.string,
      country: PropTypes.string,
      email_address: PropTypes.string,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      organization: PropTypes.string,
      study_area: PropTypes.string,
      user_type: PropTypes.string
    })
  }).isRequired,
  onUpdateNotificationLevel: PropTypes.func.isRequired
}

export default ContactInfo
