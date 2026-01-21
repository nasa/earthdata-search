import React from 'react'
import { screen } from '@testing-library/react'
import Dropdown from 'react-bootstrap/Dropdown'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import { MoreActionsDropdown } from '../MoreActionsDropdown'

const setup = setupTest({
  Component: MoreActionsDropdown,
  defaultProps: {
    children: null,
    className: null,
    handoffLinks: []
  }
})

describe('MoreActionsDropdown component', () => {
  test('renders nothing when no data is provided', () => {
    setup()
    expect(screen.queryByRole('button', { name: 'More actions' })).not.toBeInTheDocument()
  })

  test('renders correctly when handoff links are provided', async () => {
    const { user } = setup({
      overrideProps: {
        handoffLinks: [{
          title: 'Giovanni',
          href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp'
        }]
      }
    })

    await user.click(screen.getByRole('button', { name: 'More actions' }))

    expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Open collection in:' })).toBeInTheDocument()

    const snartHandoffLink = screen.getByRole('link', { name: 'Giovanni' })
    expect(snartHandoffLink).toBeInTheDocument()

    // Ensure that links can be selected with keys for coverage
    await user.type(snartHandoffLink, '{enter}')
  })

  test('renders correctly when children are provided', async () => {
    const { user } = setup({
      overrideProps: {
        children: <Dropdown.Item>Toggle Visibility</Dropdown.Item>
      }
    })

    await user.click(screen.getByRole('button', { name: 'More actions' }))

    expect(screen.getByRole('button', { name: 'Toggle Visibility' })).toBeInTheDocument()
  })

  test('renders correctly when children and handoff links are provided', async () => {
    const { user } = setup({
      overrideProps: {
        children: <Dropdown.Item>Toggle Visibility</Dropdown.Item>,
        handoffLinks: [{
          title: 'Giovanni',
          href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp'
        }]
      }
    })

    await user.click(screen.getByRole('button', { name: 'More actions' }))

    expect(screen.getByRole('button', { name: 'Toggle Visibility' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Giovanni' })).toBeInTheDocument()
  })
})
