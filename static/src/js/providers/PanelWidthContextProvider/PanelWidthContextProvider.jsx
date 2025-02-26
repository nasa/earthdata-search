import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import PanelWidthContext from '../../contexts/PanelWidthContext'

const PanelWidthContextProvider = ({ children }) => {
  // This value will get replaced immediately, so it's safe to start at 0
  const [panelsWidth, setPanelsWidth] = useState(0)

  const providerValue = useMemo(
    () => ({
      panelsWidth,
      setPanelsWidth
    }),
    [panelsWidth]
  )

  return (
    <PanelWidthContext.Provider value={providerValue}>
      {children}
    </PanelWidthContext.Provider>
  )
}

PanelWidthContextProvider.defaultProps = {
  children: null
}

PanelWidthContextProvider.propTypes = {
  children: PropTypes.node
}

export default PanelWidthContextProvider
