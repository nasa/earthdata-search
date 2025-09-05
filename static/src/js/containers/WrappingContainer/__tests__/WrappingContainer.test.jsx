import React from 'react'
import { useLocation } from 'react-router-dom'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import WrappingContainer from '../WrappingContainer'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({
    pathname: '/search',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

const setup = setupTest({
  Component: WrappingContainer,
  defaultProps: {
    children: <div data-testid="test-child">Im a child!</div>
  },
  withRouter: true
})

describe('WrappingContainer component', () => {
  test('renders container and the children', async () => {
    setup()

    expect(screen.getByTestId('parent-container')).toHaveClass('wrapping-container')
  })

  describe('when in a route that does not include the map', () => {
    test('does not render classname on saved projects', async () => {
      useLocation.mockReturnValue({
        pathname: '/contact-info'
      })

      setup()

      expect(screen.getByTestId('parent-container')).toHaveClass('wrapping-container')
    })
  })

  describe('when in a route that includes the map', () => {
    describe('project page', () => {
      test('does not include map classname on saved projects', async () => {
        useLocation.mockReturnValue({
          pathname: '/projects'
        })

        setup()

        expect(screen.getByTestId('parent-container')).toHaveClass('wrapping-container')
      })

      test('includes map classname on project page', async () => {
        useLocation.mockReturnValue({
          pathname: '/projects',
          search: '?projectid=1'
        })

        setup()

        expect(screen.getByTestId('parent-container'))
          .toHaveClass('wrapping-container', 'wrapping-container--map-page')
      })
    })

    describe('search page', () => {
      test('includes map classname on search route', async () => {
        useLocation.mockReturnValue({
          pathname: '/search'
        })

        setup()

        expect(screen.getByTestId('parent-container'))
          .toHaveClass('wrapping-container', 'wrapping-container--map-page')
      })
    })
  })
})
