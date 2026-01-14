import { screen } from '@testing-library/react'

import VariableDetailsPanel from '../VariableDetailsPanel'
import setupTest from '../../../../../../jestConfigs/setupTest'

const setup = setupTest({
  Component: VariableDetailsPanel,
  defaultProps: {
    panelHeader: '',
    variable: {
      definition: 'Variable Definition',
      name: 'Variable Name',
      longName: 'Variable Long Name'
    }
  }
})

describe('VariableDetailsPanel', () => {
  test('renders null when no variable is provided', () => {
    const { container } = setup({
      overrideProps: {
        variable: undefined
      }
    })

    expect(container.innerHTML).toBe('')
  })

  test('displays the variable details', () => {
    setup()

    expect(screen.getByText('Variable Name')).toBeInTheDocument()
    expect(screen.getByText('Variable Long Name')).toBeInTheDocument()
    expect(screen.getByText('Variable Definition')).toBeInTheDocument()
  })

  test('displays a default message when no definition is provided', () => {
    setup({
      overrideProps: {
        variable: {
          name: 'Variable Name',
          longName: 'Variable Long Name'
        }
      }
    })

    expect(screen.getByText('No definition available for this variable.')).toBeInTheDocument()
  })

  describe('when the name contains slashes', () => {
    test('should only display the text after the last slash', () => {
      setup({
        overrideProps: {
          variable: {
            name: 'path/to/VariableName',
            longName: 'Variable Long Name',
            definition: 'Variable Definition'
          }
        }
      })

      expect(screen.getByText('VariableName')).toBeInTheDocument()
    })
  })
})
