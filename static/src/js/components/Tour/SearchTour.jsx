import React, {
  useState,
  useEffect,
  useContext
} from 'react'
import Joyride, { STATUS, ACTIONS } from 'react-joyride'
import TourSteps, { TOTAL_STEPS } from './TourSteps'
import TourContext from '../../contexts/TourContext'

const SearchTour = () => {
  const { runTour, setRunTour } = useContext(TourContext)

  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        setStepIndex((prevIndex) => Math.min(prevIndex + 1, TOTAL_STEPS + 1))
      } else if (event.key === 'ArrowLeft') {
        setStepIndex((prevIndex) => Math.max(prevIndex - 1, 0))
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (runTour) {
      setStepIndex(0)
      localStorage.setItem('dontShowTour', 'false')
    }
  }, [runTour])

  useEffect(() => {
    // Scrolling to the top to ensure "Browse Portals" is visible.
    // If users are scrolled to the bottom of the Filters panel, the "Browse Portals"
    // box will be out of view, but the tour will still highlight it even through the
    // user cannot see it.
    if (stepIndex === 6) {
      const element = document.querySelector('.sidebar__content .simplebar-content-wrapper')
      if (element) {
        element.scrollTop = 0
      }
    }
  }, [stepIndex])

  const handleJoyrideCallback = (data) => {
    const {
      action,
      index,
      status,
      type
    } = data

    // Create a temporary div for the map overlay when the tour is opened
    if (action === 'start') {
      const tempDiv = document.createElement('div')
      tempDiv.classList.add('temp-right-overlay')

      const [panelEl] = document.getElementsByClassName('panels')
      panelEl.appendChild(tempDiv)
    }

    // Remove the temporary div when the tour is closed
    if (action === 'close') {
      const [tempDiv] = document.getElementsByClassName('temp-right-overlay')
      tempDiv.remove()
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED, STATUS.PAUSED].includes(status)
          || action === ACTIONS.CLOSE) {
      setRunTour(false)
      setStepIndex(0)
      localStorage.setItem('dontShowTour', 'true')
    } else if (type === 'step:after') {
      setStepIndex(action === ACTIONS.NEXT ? index + 1 : index - 1)
    }

    if (type === 'step:before') {
      const element = document.querySelector('.sidebar-section-body')
      if (element) element.scrollTop = 0
    }
  }

  return (
    <Joyride
      steps={TourSteps(stepIndex, setStepIndex, setRunTour)}
      run={runTour}
      stepIndex={stepIndex}
      continuous
      callback={handleJoyrideCallback}
      hideBackButton
      styles={
        {
          options: {
            primaryColor: '#007bff',
            zIndex: 10000,
            textAlign: 'left',
            width: '37.5rem',
            padding: '0 1.25rem'
          },
          tooltip: {
            fontSize: '1rem',
            paddingTop: '0rem',
            paddingBottom: '0rem',
            textAlign: 'left'
          },
          tooltipContent: {
            textAlign: 'left'
          }
        }
      }
    />
  )
}

export default SearchTour
