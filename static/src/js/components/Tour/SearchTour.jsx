import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Joyride, { STATUS, ACTIONS } from 'react-joyride'
import TourSteps, { TOTAL_STEPS } from './TourSteps'
import './SearchTour.scss'

const SearchTour = ({ runTour, setRunTour }) => {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const dontShowTour = localStorage.getItem('dontShowTour')
    if (dontShowTour === 'true') {
      setRunTour(false)
    }
  }, [setRunTour])

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
    }

    localStorage.setItem('dontShowTour', runTour ? 'false' : 'true')
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

    if ([STATUS.FINISHED, STATUS.SKIPPED, STATUS.PAUSED].includes(status)
          || action === ACTIONS.CLOSE) {
      setRunTour(false)
      setStepIndex(0)
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
            width: '37.5rem'
          },
          tooltip: {
            fontSize: '1rem',
            padding: '1.25rem',
            paddingTop: '0rem',
            textAlign: 'left'
          },
          tooltipContent: {
            textAlign: 'left'
          },
          buttonNext: {
          // Hide the next button since we use custom buttons
            display: 'none'
          }
        }
      }
      floaterProps={
        {
          disableAnimation: true,
          styles: {
            button: {
              borderRadius: '0.25rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem'
            }
          }
        }
      }
    />
  )
}

SearchTour.propTypes = {
  runTour: PropTypes.bool.isRequired,
  setRunTour: PropTypes.func.isRequired
}

export default SearchTour
