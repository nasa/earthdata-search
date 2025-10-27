import React, { useState, useEffect } from 'react'
import Joyride, { STATUS, ACTIONS } from 'react-joyride'

import TourSteps from './TourSteps'

import useEdscStore from '../../zustand/useEdscStore'
import { getAuthToken } from '../../zustand/selectors/user'

import { localStorageKeys } from '../../constants/localStorageKeys'

const SearchTour = () => {
  const authToken = useEdscStore(getAuthToken)
  const { runTour, setRunTour } = useEdscStore((state) => ({
    runTour: state.ui.tour.runTour,
    setRunTour: state.ui.tour.setRunTour
  }))
  const loggedIn = !!authToken

  const TOTAL_STEPS = loggedIn ? 13 : 12

  const [isChecked, setIsChecked] = useState(localStorage.getItem(localStorageKeys.dontShowTour) === 'true')
  const [stepIndex, setStepIndex] = useState(0)

  const handleCheckboxChange = (e) => {
    const newChecked = e.target.checked
    setIsChecked(newChecked)
    localStorage.setItem(localStorageKeys.dontShowTour, newChecked.toString())
  }

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
  }, [TOTAL_STEPS, loggedIn])

  useEffect(() => {
    // On the step where we highlight the map, we are creating an element
    // to overlay the visible portion of the map and highlighting that
    // element with the tour spotlight
    let overlayDiv
    if (stepIndex === 9) {
      const sidebarEl = document.querySelector('.sidebar')
      const panelEl = document.querySelector('.panels')
      const mapEl = document.querySelector('.map')

      const sidebarWidth = sidebarEl.getBoundingClientRect().width
      const panelWidth = panelEl.getBoundingClientRect().width
      const mapWidth = mapEl.getBoundingClientRect().width

      const widthDelta = mapWidth - (panelWidth + sidebarWidth)

      overlayDiv = document.createElement('div')
      overlayDiv.style.width = `${widthDelta}px`
      overlayDiv.classList.add('search-tour__target-overlay')

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
        TourSteps({
          stepIndex,
          setStepIndex,
          setRunTour,
          handleCheckboxChange,
          isChecked,
          loggedIn,
          TOTAL_STEPS
        })
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

export default SearchTour
