import React from 'react'
import { screen } from '@testing-library/react'
import Col from 'react-bootstrap/Col'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import DefinitionListItem from '../DefinitionListItem'

vi.mock('react-bootstrap/Col', () => ({
  default: vi.fn(({ children }) => <div>{children}</div>)
}))

const setup = setupTest({
  Component: DefinitionListItem,
  defaultProps: {
    label: 'Label',
    value: 'Value'
  }
})

describe('DefinitionListItem component', () => {
  test('renders label and value', () => {
    setup()
    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })

  test('renders string value type', () => {
    setup({
      overrideProps: {
        label: 'My Label',
        value: 'My Value'
      }
    })

    expect(screen.getByText('My Value')).toBeInTheDocument()
  })

  test('renders number value type', () => {
    setup({
      overrideProps: {
        label: 'Number Label',
        value: 42
      }
    })

    expect(screen.getByText('42')).toBeInTheDocument()
  })

  test('renders ReactNode value type', () => {
    setup({
      overrideProps: {
        label: 'Node Label',
        value: <span>Custom Node</span>
      }
    })

    expect(screen.getByText('Custom Node')).toBeInTheDocument()
  })

  test('passes colProps to Col', () => {
    setup({
      overrideProps: {
        label: 'With ColProps',
        value: 'Test',
        colProps: { md: 6 }
      }
    })

    expect(Col).toHaveBeenCalledTimes(1)
    expect(Col).toHaveBeenCalledWith(expect.objectContaining({ md: 6 }), {})
  })
})
