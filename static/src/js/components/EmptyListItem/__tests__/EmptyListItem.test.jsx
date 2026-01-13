import { screen } from '@testing-library/react'
import { FaBacon } from 'react-icons/fa'
import {
  AlertHighPriorityOutline
} from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'

import setupTest from '../../../../../../jestConfigs/setupTest'

import EmptyListItem from '../EmptyListItem'
import EDSCIcon from '../../EDSCIcon/EDSCIcon'

jest.mock('../../EDSCIcon/EDSCIcon', () => jest.fn(() => null))

const setup = setupTest({
  Component: EmptyListItem,
  defaultProps: {
    children: 'This is the text'
  }
})

describe('EmptyListItem component', () => {
  test('should render the text', () => {
    setup()

    expect(screen.getByText('This is the text')).toBeInTheDocument()
  })

  test('should render the warning icon by default', () => {
    setup()

    expect(EDSCIcon).toHaveBeenCalledTimes(1)
    expect(EDSCIcon).toHaveBeenCalledWith({
      className: 'empty-list-item__icon',
      icon: AlertHighPriorityOutline,
      size: '20'
    }, {})
  })

  test('should render the custom icon', () => {
    setup({
      overrideProps: {
        icon: FaBacon
      }
    })

    expect(EDSCIcon).toHaveBeenCalledTimes(1)
    expect(EDSCIcon).toHaveBeenCalledWith({
      className: 'empty-list-item__icon',
      icon: FaBacon,
      size: '20'
    }, {})
  })

  test('should add a custom class name', () => {
    setup({
      overrideProps: {
        className: 'custom-class-name'
      }
    })

    expect(screen.getByRole('listitem')).toHaveClass('custom-class-name')
  })
})
