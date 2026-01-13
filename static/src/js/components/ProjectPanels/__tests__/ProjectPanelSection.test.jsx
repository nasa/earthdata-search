import React from 'react'
import { screen, within } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import ProjectPanelSection from '../ProjectPanelSection'

const setup = setupTest({
  Component: ProjectPanelSection,
  defaultProps: {
    heading: 'Test Heading',
    children: <div>Test Children</div>
  }
})

describe('ProjectPanelSelection', () => {
  test('displays a heading and children', () => {
    setup()

    expect(screen.getByRole('heading', { level: 3 }).textContent).toEqual('Test Heading')
    expect(screen.getByText('Test Children')).toBeInTheDocument()
  })

  test('does not display heading if it is not provided', () => {
    setup({
      overrideProps: {
        heading: null
      }
    })

    expect(screen.queryByRole('heading', { level: 3 })).toBeNull()
    expect(screen.getByText('Test Children')).toBeInTheDocument()
  })

  test('does not display children if it is not provided', () => {
    setup({
      overrideProps: {
        children: null
      }
    })

    expect(screen.getByRole('heading', { level: 3 }).textContent).toEqual('Test Heading')
    expect(screen.queryByText('Test Children')).not.toBeInTheDocument()
  })

  describe('when the project panel is nested', () => {
    test('adds the modifier class', () => {
      setup({
        overrideProps: {
          nested: true
        }
      })

      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByRole('heading', { level: 3 }).parentElement.className).toContain('project-panel-section--is-nested')
    })
  })

  describe('when the project panel is a step', () => {
    test('displays a step indicator and adds the modifier class', () => {
      setup({
        overrideProps: {
          step: 1
        }
      })

      const heading = screen.getByRole('heading', { level: 3 })

      // eslint-disable-next-line testing-library/no-node-access
      expect(within(heading).getByText('1')).toBeInTheDocument()
    })
  })

  describe('when a custom heading level is used', () => {
    test('displays a custom heading level', () => {
      setup({
        overrideProps: {
          headingLevel: 'h4'
        }
      })

      expect(screen.getByRole('heading', { level: 4 }).textContent).toEqual('Test Heading')
    })
  })

  describe('when intro text is provided', () => {
    test('displays the intro text', () => {
      setup({
        overrideProps: {
          intro: 'some intro text'
        }
      })

      expect(screen.getByText('some intro text')).toBeInTheDocument()
    })
  })

  describe('when warning text is provided', () => {
    test('displays an alert', () => {
      setup({
        overrideProps: {
          warning: 'This is a test warning'
        }
      })

      expect(screen.getByText('This is a test warning')).toBeInTheDocument()
      expect(screen.getByRole('alert').className).toContain('alert-warning')
    })
  })
})
