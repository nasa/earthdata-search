import React, {
  useState,
  useEffect,
  useContext
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Joyride, { STATUS, ACTIONS } from 'react-joyride'

import TourSteps, { TOTAL_STEPS } from './TourSteps'
import TourContext from '../../contexts/TourContext'

const mapStateToProps = (state) => ({
  tourPreference: state.preferences.preferences.showTourPreference
})

const SearchTour = ({ tourPreference }) => {
  const getDefaultCheckboxValue = () => {
    switch (tourPreference) {
      case 'showtour':
        return false

      case 'dontshowtour':
        return true

      default:
        return localStorage.getItem('dontShowTour') === 'true'
    }
  }

  const { runTour, setRunTour } = useContext(TourContext)

  const [isDontShowChecked, setIsDontShowChecked] = useState(getDefaultCheckboxValue())
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

    // On the step where we highlight the map, we are creating an element
    // to overlay the visible portion of the map and highlighting that
    // element with the tour spotlight
    let overlayDiv
    if (stepIndex === 10) {
      const sidebarEl = document.querySelector('.sidebar')
      const panelEl = document.querySelector('.panels')
      const mapEl = document.querySelector('.map')

      const sidebarWidth = sidebarEl.getBoundingClientRect().width
      const panelWidth = panelEl.getBoundingClientRect().width
      const mapWidth = mapEl.getBoundingClientRect().width

      const widthDelta = mapWidth - (panelWidth + sidebarWidth)

      overlayDiv = document.createElement('div')
      overlayDiv.style.width = `${widthDelta}px`
      overlayDiv.classList.add('target-overlay')

      if (panelEl) {
        panelEl.appendChild(overlayDiv)
      }
    }

    return () => {
      if (overlayDiv) {
        overlayDiv.remove()
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
  }

  return (
    <Joyride
      steps={
        TourSteps(
          stepIndex,
          setStepIndex,
          setRunTour,
          isDontShowChecked,
          setIsDontShowChecked,
          tourPreference
        )
      }
      run={runTour}
      stepIndex={stepIndex}
      continuous
      callback={handleJoyrideCallback}
      disableScrollParentFix
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

SearchTour.propTypes = {
  tourPreference: PropTypes.string.isRequired
}

export default connect(mapStateToProps)(SearchTour)
