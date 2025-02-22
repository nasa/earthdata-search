import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import PanelWidthContext from '../../contexts/PanelWidthContext'

const PanelWidthContextProvider = ({ children }) => {
  const [panelsWidth, setPanelsWidth] = useState(500)

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
