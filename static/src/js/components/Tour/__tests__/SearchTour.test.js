import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import SearchTour from './SearchTour'

describe('SearchTour component', () => {
  const mockSetRunTour = jest.fn()

  beforeEach(() => {
    mockSetRunTour.mockClear()
    localStorage.clear()
  })

  test('renders the SearchTour component', () => {
    render(<SearchTour runTour={true} setRunTour={mockSetRunTour} />)
    expect(screen.getByText(/Welcome to Earthdata Search!/i)).toBeInTheDocument()
  })

  test('displays the step counter', () => {
    render(<SearchTour runTour={true} setRunTour={mockSetRunTour} />)
    expect(screen.getByText(/1 OF 12/i)).toBeInTheDocument()
  })

  test('navigates to the next step', () => {
    render(<SearchTour runTour={true} setRunTour={mockSetRunTour} />)

    const nextButton = screen.getByText(/Take the tour/i)
    fireEvent.click(nextButton)

    expect(screen.getByText(/2 OF 12/i)).toBeInTheDocument()
  })

  test('skips the tour when "Skip for now" is clicked', () => {
    render(<SearchTour runTour={true} setRunTour={mockSetRunTour} />)

    const skipButton = screen.getByText(/Skip for now/i)
    fireEvent.click(skipButton)

    expect(mockSetRunTour).toHaveBeenCalledWith(false)
  })

  test('sets "dontShowTour" in localStorage when tour is started', () => {
    render(<SearchTour runTour={true} setRunTour={mockSetRunTour} />)

    expect(localStorage.getItem('dontShowTour')).toBe('false')
  })

  test('removes tour on finish', () => {
    render(<SearchTour runTour={true} setRunTour={mockSetRunTour} />)

    const nextButton = screen.getByText(/Take the tour/i)
    fireEvent.click(nextButton)
    fireEvent.click(nextButton)

    const finishButton = screen.getByText(/Finish Tour/i)
    fireEvent.click(finishButton)

    expect(mockSetRunTour).toHaveBeenCalledWith(false)
  })

  test('handles arrow key navigation', () => {
    render(<SearchTour runTour={true} setRunTour={mockSetRunTour} />)

    // Simulate pressing the right arrow key
    fireEvent.keyDown(window, { key: 'ArrowRight' })

    expect(screen.getByText(/2 OF 12/i)).toBeInTheDocument()
  })
})
