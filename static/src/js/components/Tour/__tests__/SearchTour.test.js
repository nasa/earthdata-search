import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import SearchTour from '../SearchTour'

// Mock the local storage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
}
global.localStorage = localStorageMock

describe('SearchTour', () => {
  const mockSetRunTour = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when rendered', () => {
    it('displays the tour component', () => {
      render(<SearchTour runTour setRunTour={mockSetRunTour} />)
      expect(screen.getByTestId('mocked-joyride')).toBeInTheDocument()
    })
  })
})
