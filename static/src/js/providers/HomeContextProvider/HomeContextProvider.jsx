import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import HomeContext from '../../contexts/HomeContext'

const HomeContextProvider = ({ children }) => {
  const [startDrawing, setStartDrawing] = useState(false)
  const [openKeywordFacet, setOpenKeywordFacet] = useState(false)

  const providerValue = useMemo(
    () => ({
      startDrawing,
      setStartDrawing,
      openKeywordFacet,
      setOpenKeywordFacet
    }),
    [startDrawing, openKeywordFacet]
  )

  return (
    <HomeContext.Provider value={providerValue}>
      {children}
    </HomeContext.Provider>
  )
}

HomeContextProvider.defaultProps = {
  children: null
}

HomeContextProvider.propTypes = {
  children: PropTypes.node
}

export default HomeContextProvider
