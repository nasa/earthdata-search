import React, {
  useState,
  useMemo,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import StartDrawingContext from '../../contexts/StartDrawingContext'

const StartDrawingContextProvider = ({ children }) => {
  const [startDrawing, setStartDrawing] = useState()

  const providerValue = useMemo(
    () => ({
      startDrawing,
      setStartDrawing
    }),
    [startDrawing]
  )

  return (
    <StartDrawingContext.Provider value={providerValue}>
      {children}
    </StartDrawingContext.Provider>
  )
}

StartDrawingContextProvider.defaultProps = {
  children: null
}

StartDrawingContextProvider.propTypes = {
  children: PropTypes.node
}

export default StartDrawingContextProvider
