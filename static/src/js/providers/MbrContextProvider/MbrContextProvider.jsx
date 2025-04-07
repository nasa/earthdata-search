import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import MbrContext from '../../contexts/MbrContext'

const MbrContextProvider = ({ children }) => {
  const [showMbr, setShowMbr] = useState(false)

  const providerValue = useMemo(
    () => ({
      showMbr,
      setShowMbr
    }),
    [showMbr]
  )

  return (
    <MbrContext.Provider value={providerValue}>
      {children}
    </MbrContext.Provider>
  )
}

MbrContextProvider.defaultProps = {
  children: null
}

MbrContextProvider.propTypes = {
  children: PropTypes.node
}

export default MbrContextProvider
