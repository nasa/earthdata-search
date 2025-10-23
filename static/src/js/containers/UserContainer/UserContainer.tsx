import React, { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import { remove } from 'tiny-cookie'
import { useNavigate } from 'react-router-dom'

import GET_USER from '../../operations/queries/getUser'

// @ts-expect-error The file does not have types
import actions from '../../actions/index'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'

import Spinner from '../../components/Spinner/Spinner'

import type { UrsProfile } from '../../types/sharedTypes'

// @ts-expect-error Don't want to define types for all of Redux
export const mapStateToProps = (state) => ({
  authToken: state.authToken
})

type ContactInfo = {
  ursProfile: UrsProfile
}

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onHandleError: (errorConfig: unknown) => dispatch(actions.handleError(errorConfig)),
  onUpdateAuthToken:
    (token: string) => dispatch(actions.updateAuthToken(token)),
  onUpdateContactInfo:
    (contactInfo: ContactInfo) => dispatch(actions.updateContactInfo(contactInfo))
})

interface UserContainerProps {
  /** The authentication token */
  authToken: string
  /** The child components */
  children: React.ReactNode
  /** Function to handle errors */
  onHandleError: (errorConfig: unknown) => void
  /** Function to update the authentication token */
  onUpdateAuthToken: (token: string) => void
  /** Function to update the user's contact information */
  onUpdateContactInfo: (contactInfo: ContactInfo) => void
}

export const UserContainer: React.FC<UserContainerProps> = ({
  authToken,
  children,
  onHandleError,
  onUpdateAuthToken,
  onUpdateContactInfo
}) => {
  const setSitePreferences = useEdscStore((state) => state.user.setSitePreferences)
  const setUsername = useEdscStore((state) => state.user.setUsername)
  const earthdataEnvironment = useEdscStore(getEarthdataEnvironment)

  const navigate = useNavigate()

  const [preferencesLoaded, setPreferencesLoaded] = useState(false)

  // When the page loads, check local storage for user information
  useEffect(() => {
    if (authToken) {
      const localUser = localStorage.getItem('edscUser')

      // If the user information exists in local storage, update the state
      if (localUser) {
        const {
          sitePreferences,
          ursProfile
        } = JSON.parse(localUser)

        setSitePreferences(sitePreferences)
        onUpdateContactInfo({ ursProfile })

        // Set the preferences as loaded to unblock the rest of the application
        setPreferencesLoaded(true)
      }
    }
  }, [authToken])

  // Fetch the user data when we have an authToken
  const { data, error } = useQuery(gql(GET_USER), {
    skip: !authToken
  })

  useEffect(() => {
    if (error) {
      // Delete the authToken cookie
      remove('authToken')

      // Update the authToken in Redux
      onUpdateAuthToken('')

      // Clear the user information from local storage
      localStorage.removeItem('edscUser')

      // Show an error banner
      onHandleError({
        error,
        action: 'getUser query',
        title: 'Something went wrong while logging in'
      })

      // Redirect to the search page
      navigate(`/search?ee=${earthdataEnvironment}`, { replace: true })
    }
  }, [error])

  useEffect(() => {
    if (data && data.user) {
      const { user } = data
      const {
        sitePreferences,
        ursProfile,
        ursId
      } = user

      // Update the state with the user information
      setSitePreferences(sitePreferences)
      setUsername(ursId)
      onUpdateContactInfo({ ursProfile })

      // Save the user information to local storage
      localStorage.setItem('edscUser', JSON.stringify({
        sitePreferences,
        ursProfile
      }))

      setPreferencesLoaded(true)
    }
  }, [data])

  // If the user is logged in, but doesn't have preferences from either local storage
  // or the API, show a spinner
  if (authToken && !preferencesLoaded) {
    return (
      <Spinner
        className="root__spinner spinner spinner--dots spinner--small"
        type="dots"
      />
    )
  }

  // Render the child components
  return children
}

export default connect(mapStateToProps, mapDispatchToProps)(UserContainer)
