import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { remove } from 'tiny-cookie'
import { useNavigate } from 'react-router-dom'

import GET_USER from '../../operations/queries/getUser'

import useEdscStore from '../../zustand/useEdscStore'
import { getAuthToken } from '../../zustand/selectors/user'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'

import Spinner from '../Spinner/Spinner'

import { localStorageKeys } from '../../constants/localStorageKeys'

interface UserLoaderProps {
  /** The child components */
  children: React.ReactNode
}

export const UserLoader: React.FC<UserLoaderProps> = ({
  children
}) => {
  const authToken = useEdscStore(getAuthToken)
  const setAuthToken = useEdscStore((state) => state.user.setAuthToken)
  const setUrsProfile = useEdscStore((state) => state.user.setUrsProfile)
  const setSitePreferences = useEdscStore((state) => state.user.setSitePreferences)
  const setUsername = useEdscStore((state) => state.user.setUsername)
  const earthdataEnvironment = useEdscStore(getEarthdataEnvironment)
  const handleError = useEdscStore((state) => state.errors.handleError)

  const navigate = useNavigate()

  const [preferencesLoaded, setPreferencesLoaded] = useState(false)

  // When the page loads, check local storage for user information
  useEffect(() => {
    if (authToken) {
      const localUser = localStorage.getItem(localStorageKeys.user)

      // If the user information exists in local storage, update the state
      if (localUser) {
        const {
          sitePreferences,
          ursProfile
        } = JSON.parse(localUser)

        setSitePreferences(sitePreferences)
        setUrsProfile(ursProfile)

        // Set the preferences as loaded to unblock the rest of the application
        setPreferencesLoaded(true)
      }
    }
  }, [authToken])

  // Fetch the user data when we have an authToken
  const { data, error } = useQuery(GET_USER, {
    skip: !authToken
  })

  useEffect(() => {
    if (error) {
      // Delete the authToken cookie
      remove('authToken')

      // Update the store
      setAuthToken(null)
      setUrsProfile(null)

      // Clear the user information from local storage
      localStorage.removeItem(localStorageKeys.user)

      // Show an error banner
      handleError({
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
      setUrsProfile(ursProfile)

      // Save the user information to local storage
      localStorage.setItem(localStorageKeys.user, JSON.stringify({
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

export default UserLoader
