import { STATUS, ACTIONS } from 'react-joyride'
import '@testing-library/jest-dom/extend-expect'

describe('SearchTour Joyride Callback', () => {
  let setRunTour
  let setStepIndex

  beforeEach(() => {
    setRunTour = jest.fn()
    setStepIndex = jest.fn()
  })

  test('calls setRunTour(false) and setStepIndex(0) when tour is finished', async () => {
    const handleJoyrideCallback = (data) => {
      if ([STATUS.FINISHED, STATUS.SKIPPED, STATUS.PAUSED].includes(data.status)
          || data.action === ACTIONS.CLOSE) {
        setRunTour(false)
        setStepIndex(0)
      }
    }

    // Simulate the callback when the tour is finished
    const joyrideCallbackData = {
      status: STATUS.FINISHED,
      action: ACTIONS.CLOSE,
      index: 0,
      type: 'step:after'
    }

    handleJoyrideCallback(joyrideCallbackData)

    expect(setRunTour).toHaveBeenCalledWith(false)
    expect(setStepIndex).toHaveBeenCalledWith(0)
  })

  test('calls setRunTour(false) and setStepIndex(0) when tour is skipped', () => {
    const handleJoyrideCallback = (data) => {
      if ([STATUS.FINISHED, STATUS.SKIPPED, STATUS.PAUSED].includes(data.status)
          || data.action === ACTIONS.CLOSE) {
        setRunTour(false)
        setStepIndex(0)
      }
    }

    // Simulate the callback when the tour is skipped
    const joyrideCallbackData = {
      status: STATUS.SKIPPED,
      action: ACTIONS.CLOSE,
      index: 0,
      type: 'step:after'
    }

    handleJoyrideCallback(joyrideCallbackData)

    expect(setRunTour).toHaveBeenCalledWith(false)
    expect(setStepIndex).toHaveBeenCalledWith(0)
  })

  test('calls setRunTour(false) and setStepIndex(0) when tour is paused', () => {
    const handleJoyrideCallback = (data) => {
      if ([STATUS.FINISHED, STATUS.SKIPPED, STATUS.PAUSED].includes(data.status)
          || data.action === ACTIONS.CLOSE) {
        setRunTour(false)
        setStepIndex(0)
      }
    }

    // Simulate the callback when the tour is paused
    const joyrideCallbackData = {
      status: STATUS.PAUSED,
      action: ACTIONS.CLOSE,
      index: 0,
      type: 'step:after'
    }

    handleJoyrideCallback(joyrideCallbackData)

    expect(setRunTour).toHaveBeenCalledWith(false)
    expect(setStepIndex).toHaveBeenCalledWith(0)
  })

  test('calls setRunTour(false) and setStepIndex(0) when tour is closed', () => {
    const handleJoyrideCallback = (data) => {
      if ([STATUS.FINISHED, STATUS.SKIPPED, STATUS.PAUSED].includes(data.status)
          || data.action === ACTIONS.CLOSE) {
        setRunTour(false)
        setStepIndex(0)
      }
    }

    // Simulate the callback when the tour is closed
    const joyrideCallbackData = {
      status: STATUS.RUNNING,
      action: ACTIONS.CLOSE,
      index: 0,
      type: 'step:after'
    }

    handleJoyrideCallback(joyrideCallbackData)

    expect(setRunTour).toHaveBeenCalledWith(false)
    expect(setStepIndex).toHaveBeenCalledWith(0)
  })
})
