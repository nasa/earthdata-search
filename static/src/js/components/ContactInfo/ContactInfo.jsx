import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'

import { ArrowLineDiagonal } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { getEarthdataConfig } from '../../../../../sharedUtils/config'

import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'

import useEdscStore from '../../zustand/useEdscStore'
import { getUrsProfile } from '../../zustand/selectors/user'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'

import { apolloClientNames } from '../../constants/apolloClientNames'

import GET_CMR_ORDERING_USER from '../../operations/queries/getCmrOrderingUser'
import UPDATE_CMR_ORDERING_USER from '../../operations/mutations/updateCmrOrderingUser'

import addToast from '../../util/addToast'

import './ContactInfo.scss'

const ContactInfo = () => {
  const ursProfile = useEdscStore(getUrsProfile)
  const handleError = useEdscStore((state) => state.errors.handleError)

  const {
    affiliation,
    country,
    emailAddress,
    firstName,
    lastName,
    organization,
    studyArea,
    uid,
    userType
  } = ursProfile

  const {
    data,
    loading: cmrOrderingLoading,
    error
  } = useQuery(GET_CMR_ORDERING_USER, {
    variables: {
      ursId: uid
    },
    context: {
      clientName: apolloClientNames.CMR_ORDERING
    }
  })

  const [updateNotificationLevelMutation] = useMutation(UPDATE_CMR_ORDERING_USER, {
    context: {
      clientName: apolloClientNames.CMR_ORDERING
    }
  })

  useEffect(() => {
    if (error) {
      console.error('Error fetching CMR ordering user:', error)
    }
  }, [error])

  const { user: cmrOrderingUser = {} } = data || {}

  const {
    notificationLevel: propsNotificationLevel
  } = cmrOrderingUser

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
    updateNotificationLevelMutation({
      variables: {
        ursId: uid,
        notificationLevel
      },
      onCompleted: () => {
        addToast('Notification Preference Level updated', {
          appearance: 'success',
          autoDismiss: true
        })
      },
      onError: (mutationError) => {
        handleError({
          error: mutationError,
          action: 'updateNotificationLevel',
          resource: 'contactInfo',
          verb: 'updating'
        })
      }
    })
  }

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

      <hr />

      <h3>Update Notification Preference Level</h3>

      <div className="mb-2">
        <label htmlFor="notificationLevel">
          Receive delayed access notifications
        </label>
        {' '}
        {
          cmrOrderingLoading
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
        disabled={cmrOrderingLoading}
      >
        Update Notification Preference
      </Button>

    </fieldset>
  )
}

export default ContactInfo
