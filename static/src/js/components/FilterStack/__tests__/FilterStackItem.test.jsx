import { screen } from '@testing-library/react'
import { FaCrop } from 'react-icons/fa'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import FilterStackItem from '../FilterStackItem'
import EDSCIcon from '../../EDSCIcon/EDSCIcon'

vi.mock('../../EDSCIcon/EDSCIcon', () => ({ default: vi.fn(() => null) }))

const setup = setupTest({
  Component: FilterStackItem,
  defaultProps: {
    children: 'Hello!',
    icon: FaCrop,
    title: 'Test'
  }
})

describe('FilterStackItem component', () => {
  test('renders itself as a list item', () => {
    setup()

    expect(screen.getByRole('listitem')).toBeInTheDocument()
  })

  test('renders its body contents correctly', () => {
    setup()

    expect(screen.getByText('Hello!')).toBeInTheDocument()
  })

  test('renders an icon', () => {
    setup()

    expect(EDSCIcon).toHaveBeenCalledTimes(1)
    expect(EDSCIcon).toHaveBeenCalledWith({
      className: 'filter-stack-item__icon',
      icon: FaCrop,
      title: 'Test'
    }, {})
  })

  test('renders a title', () => {
    setup()

    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  test('renders a secondary title', () => {
    setup({
      overrideProps: {
        secondaryTitle: 'Secondary Title'
      }
    })

    expect(screen.getByText('Secondary Title')).toBeInTheDocument()
  })

  test('renders a hint when provided', () => {
    setup({
      overrideProps: {
        hint: 'This is a hint'
      }
    })

    expect(screen.getByText('This is a hint')).toBeInTheDocument()
  })

  test('renders an error when provided', () => {
    setup({
      overrideProps: {
        error: 'This is an error'
      }
    })

    expect(screen.getByText('This is an error')).toBeInTheDocument()
  })

  test('adds the correct class when the icon is `edsc-globe`', () => {
    setup({
      overrideProps: {
        icon: 'edsc-globe'
      }
    })

    expect(EDSCIcon).toHaveBeenCalledWith({
      className: 'edsc-icon-globe-grid filter-stack-item__icon filter-stack-item__icon--small',
      icon: 'edsc-globe',
      title: 'Test'
    }, {})
  })

  describe('when clicking the remove button', () => {
    test('calls the onRemove callback', async () => {
      const { props, user } = setup({
        overrideProps: {
          onRemove: vi.fn()
        }
      })

      const button = screen.getByRole('button', { name: /remove test filter/i })

      await user.click(button)

      expect(props.onRemove).toHaveBeenCalledTimes(1)
      expect(props.onRemove).toHaveBeenCalledWith()
    })
  })
})
