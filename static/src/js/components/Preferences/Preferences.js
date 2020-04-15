import React, {
  lazy,
  Suspense
} from 'react'
import PropTypes from 'prop-types'

import Spinner from '../Spinner/Spinner'

import './Preferences.scss'

const PreferencesForm = lazy(() => import('./PreferencesForm'))

/**
 * Renders the Contact Info form
 */
const Preferences = ({ preferences, onUpdatePreferences }) => (
  <div className="preferences">
    <Suspense
      fallback={(
        <div className="preferences__loading">
          <Spinner type="dots" size="small" />
        </div>
      )}
    >
      <PreferencesForm
        preferences={preferences}
        onUpdatePreferences={onUpdatePreferences}
      />
    </Suspense>
  </div>
)

Preferences.propTypes = {
  preferences: PropTypes.shape({}).isRequired,
  onUpdatePreferences: PropTypes.func.isRequired
}

export default Preferences
