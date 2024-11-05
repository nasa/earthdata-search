import React, {
  useState,
  useMemo,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import TourContext from '../../contexts/TourContext'
import { getApplicationConfig } from '../../../../../sharedUtils/config'

const { disableSiteTour } = getApplicationConfig()
const isSiteTourEnabled = disableSiteTour === 'false'

const TourContextProvider = ({ children }) => {
  const [runTour, setRunTour] = useState(0)
  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost'
    const overrideLocalhost = window.overrideLocalhost === true
    const shouldShowTour = isSiteTourEnabled && (!isLocalhost || overrideLocalhost) ? 1 : 0
    setRunTour(shouldShowTour)
  }, [])

  const providerValue = useMemo(
    () => ({
      runTour,
      setRunTour
    }),
    [runTour]
  )

  return (
    <TourContext.Provider value={providerValue}>
      {children}
    </TourContext.Provider>
  )
}

TourContextProvider.defaultProps = {
  children: null
}

TourContextProvider.propTypes = {
  children: PropTypes.node
}

export default TourContextProvider
