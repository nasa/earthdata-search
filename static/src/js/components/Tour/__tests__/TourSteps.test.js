import { render, fireEvent } from '@testing-library/react'
import TourSteps from '../TourSteps'
import '@testing-library/jest-dom/extend-expect'

describe('TourSteps Navigation', () => {
  test('should navigate to the previous step when the "Previous" button is clicked', () => {
    const setStepIndex = jest.fn()
    const stepIndex = 2
    const steps = TourSteps(stepIndex, setStepIndex, jest.fn())

    const { content } = steps[stepIndex]

    const { getByText } = render(content)

    fireEvent.click(getByText('Previous'))

    expect(setStepIndex).toHaveBeenCalledWith(stepIndex - 1)
  })

  test('should navigate to the next step when the "Next" button is clicked', () => {
    const setStepIndex = jest.fn()
    const stepIndex = 2
    const steps = TourSteps(stepIndex, setStepIndex, jest.fn())

    const { content } = steps[stepIndex]
    const { getByText } = render(content)

    fireEvent.click(getByText('Next'))

    expect(setStepIndex).toHaveBeenCalledWith(stepIndex + 1)
  })

  test('should skip the tour and reset step index when the "Skip for now" button is clicked', () => {
    const setStepIndex = jest.fn()
    const setRunTour = jest.fn()
    const stepIndex = 0
    const steps = TourSteps(stepIndex, setStepIndex, setRunTour)

    const { content } = steps[stepIndex]
    const { getByText } = render(content)

    fireEvent.click(getByText('Skip for now'))

    expect(setRunTour).toHaveBeenCalledWith(false)
    expect(setStepIndex).toHaveBeenCalledWith(0)
  })
})
