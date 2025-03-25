import React from 'react'
import { render, screen } from '@testing-library/react'

import { FaQuestionCircle } from 'react-icons/fa'

import EDSCIcon from '../EDSCIcon'

describe('EDSCIcon component', () => {
  test('should render an icon', async () => {
    render(<EDSCIcon icon={FaQuestionCircle} />)

    const icon = await screen.findByTestId('edsc-icon')

    expect(icon).toBeTruthy()
  })

  describe('when an icon is not provided', () => {
    test('should render nothing', async () => {
      const { container } = render(<EDSCIcon />)

      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('when classes are supplied', () => {
    test('should add the class name', async () => {
      render(<EDSCIcon className="test-class" icon={FaQuestionCircle} />)

      const icon = await screen.findByTestId('edsc-icon-wrapper')

      expect(icon.classList.contains('test-class')).toBeTruthy()
    })
  })

  describe('when a variant is supplied', () => {
    test('should add the variant', async () => {
      render(<EDSCIcon variant="test-variant" icon={FaQuestionCircle} />)

      const icon = await screen.findByTestId('edsc-icon-wrapper')

      expect(icon.classList.contains('edsc-icon--test-variant')).toBeTruthy()
    })
  })

  describe('when an aria-label is supplied', () => {
    test('should add the aria-label', async () => {
      render(<EDSCIcon ariaLabel="test-aria-label" icon={FaQuestionCircle} />)

      expect(await screen.findByLabelText('test-aria-label')).toBeInTheDocument()
    })
  })

  describe('when children are provided', () => {
    test('should render the children', async () => {
      render(
        <EDSCIcon icon={FaQuestionCircle}>
          <div data-testid="test-child">Test</div>
        </EDSCIcon>
      )

      const child = await screen.findByTestId('test-child')

      expect(child).toBeTruthy()
    })
  })

  describe('when an icon is not found', () => {
    test('should render a simple icon', async () => {
      render(<EDSCIcon icon="noIcon" />)
      const icon = await screen.findByTestId('edsc-icon-simple')

      expect(icon).toBeTruthy()
    })
  })

  describe('when a context is provided', () => {
    test('should render an icon', async () => {
      render(<EDSCIcon icon={FaQuestionCircle} context={{ style: { width: '10rem' } }} />)

      const icon = await screen.findByTestId('edsc-icon')

      expect(icon).toHaveStyle({ width: '10rem' })
    })
  })
})
