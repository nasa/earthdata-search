import { screen } from '@testing-library/react'
import setupTest from '../../../../../../jestConfigs/setupTest'
import DefinitionList from '../DefinitionList'

const setup = setupTest({
  Component: DefinitionList,
  defaultProps: {
    items: []
  }
})

describe('DefinitionList component', () => {
  test('renders nothing if items prop is empty', () => {
    setup()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  test('renders single item correctly', () => {
    const item = {
      label: 'Test Label',
      value: 'Test Value'
    }
    setup({
      overrideProps: {
        items: [item]
      }
    })

    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('Test Value')).toBeInTheDocument()
  })

  test('renders multiple items as separate rows', () => {
    const items = [
      {
        label: 'Label 1',
        value: 'Value 1'
      },
      {
        label: 'Label 2',
        value: 'Value 2'
      }
    ]
    setup({
      overrideProps: { items }
    })

    expect(screen.getByText('Label 1')).toBeInTheDocument()
    expect(screen.getByText('Value 1')).toBeInTheDocument()
    expect(screen.getByText('Label 2')).toBeInTheDocument()
    expect(screen.getByText('Value 2')).toBeInTheDocument()
  })

  test('renders nested arrays of items in separate rows', () => {
    const items = [
      [
        {
          label: 'Row 1 Label 1',
          value: 'Row 1 Value 1'
        },
        {
          label: 'Row 1 Label 2',
          value: 'Row 1 Value 2'
        }
      ],
      [
        {
          label: 'Row 2 Label 1',
          value: 'Row 2 Value 1'
        }
      ]
    ]
    setup({
      overrideProps: { items }
    })

    expect(screen.getByText('Row 1 Label 1')).toBeInTheDocument()
    expect(screen.getByText('Row 1 Value 1')).toBeInTheDocument()
    expect(screen.getByText('Row 1 Label 2')).toBeInTheDocument()
    expect(screen.getByText('Row 1 Value 2')).toBeInTheDocument()
    expect(screen.getByText('Row 2 Label 1')).toBeInTheDocument()
    expect(screen.getByText('Row 2 Value 1')).toBeInTheDocument()
  })
})
