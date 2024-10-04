import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import TourSteps from '../TourSteps'
import '@testing-library/jest-dom/extend-expect'

describe('TourSteps Navigation', () => {
  test('calls setStepIndex(stepIndex - 1) when Previous button is clicked', () => {
    const setStepIndex = jest.fn()
    const setRunTour = jest.fn()
    const stepIndex = 2

    const steps = TourSteps(stepIndex, setStepIndex, setRunTour)

    // Render the second step (index [1]) including buttons
    const { getByText } = render(
      <div>
        {steps[1].content}
      </div>
    )

    // Simulate clicking the Previous button
    const previousButton = getByText('Previous')
    fireEvent.click(previousButton)

    // Assert that setStepIndex was called with stepIndex - 1
    expect(setStepIndex).toHaveBeenCalledWith(stepIndex - 1)
  })

  test('calls setRunTour(false) and setStepIndex(0) when "Skip for now" button is clicked', () => {
    const setStepIndex = jest.fn()
    const setRunTour = jest.fn()
    const stepIndex = 0

    const steps = TourSteps(stepIndex, setStepIndex, setRunTour)

    // Render the first step (index [0]) including buttons
    const { getByText } = render(
      <div>
        {steps[0].content}
      </div>
    )

    // Simulate clicking the "Skip for now" button
    const skipButton = getByText('Skip for now')
    fireEvent.click(skipButton)

    // Assert that setRunTour was called with false and setStepIndex was called with 0
    expect(setRunTour).toHaveBeenCalledWith(false)
    expect(setStepIndex).toHaveBeenCalledWith(0)
  })
})
