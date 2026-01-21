import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import MoreActionsDropdownItem from '../MoreActionsDropdownItem'
import EDSCIcon from '../../EDSCIcon/EDSCIcon'
import Spinner from '../../Spinner/Spinner'

vi.mock('../../EDSCIcon/EDSCIcon', () => ({ default: vi.fn(() => null) }))
vi.mock('../../Spinner/Spinner', () => ({ default: vi.fn(() => null) }))

const setup = setupTest({
  Component: MoreActionsDropdownItem,
  defaultProps: {
    className: 'test-class',
    icon: 'FaGlobal',
    onClick: vi.fn(),
    title: 'Test Title'
  }
})

describe('MoreActionsDropdownItem component', () => {
  test('adds the className', () => {
    setup()

    expect(screen.getByRole('button').className).toContain('test-class more-actions-dropdown-item')
  })

  test('adds an icon', () => {
    setup()

    expect(EDSCIcon).toHaveBeenCalledTimes(1)
    expect(EDSCIcon).toHaveBeenCalledWith({
      className: 'more-actions-dropdown-item__icon',
      icon: 'FaGlobal',
      size: '12'
    }, {})
  })

  test('displays the text', () => {
    setup()

    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  test('calls the onClick callback', async () => {
    const { props, user } = setup()

    await user.click(screen.getByRole('button'))

    expect(props.onClick).toHaveBeenCalledTimes(1)
    expect(props.onClick).toHaveBeenCalledWith(expect.objectContaining({
      type: 'click'
    }))
  })

  test('renders a spinner when inProgress is true', () => {
    setup({
      overrideProps: {
        inProgress: true
      }
    })

    expect(Spinner).toHaveBeenCalledTimes(1)
    expect(Spinner).toHaveBeenCalledWith({
      className: 'radio-setting-dropdown-item__spinner',
      inline: true,
      size: 'x-tiny',
      type: 'dots'
    }, {})
  })
})
