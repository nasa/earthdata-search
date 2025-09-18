import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'
import DefinitionListItem from '../DefinitionListItem'

describe('DefinitionListItem component', () => {
  const setup = setupTest({
    Component: DefinitionListItem,
    defaultProps: {
      label: 'Label',
      value: 'Value'
    }
  })

  test('renders label and value', () => {
    setup()
    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })

  test('renders string value type', () => {
    setup({
      overrideProps: { label: 'My Label', value: 'My Value' }
    })
    expect(screen.getByText('My Value')).toBeInTheDocument()
  })

  test('renders number value type', () => {
    setup({
      overrideProps: { label: 'Number Label', value: 42 }
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

    expect(screen.getByText('With ColProps').closest('.col-md-6')).not.toBeNull()
  })
})
