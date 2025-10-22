import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import PreferencesForm from '../../components/Preferences/PreferencesForm'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { routes } from '../../constants/routes'
import actions from '../../actions'

export const mapDispatchToProps = (dispatch) => ({
  onHandleError: (data) => dispatch(actions.handleError(data))
})

/**
 * The Preferences route component
*/
export const Preferences = ({
  onHandleError
}) => {
  const { edscHost } = getEnvironmentConfig()

  return (
    <>
      <Helmet>
        <title>Preferences</title>
        <meta name="title" content="Preferences" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${edscHost}${routes.PREFERENCES}`} />
      </Helmet>
      <div className="route-wrapper route-wrapper--light route-wrapper--content-page">
        <div className="route-wrapper__content">
          <div className="route-wrapper__content-inner">
            <div className="preferences">
              <PreferencesForm onHandleError={onHandleError} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Preferences.propTypes = {
  onHandleError: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(Preferences)
