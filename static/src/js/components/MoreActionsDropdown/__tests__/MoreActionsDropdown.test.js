import React from 'react'
import {
  act,
  render,
  screen
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'

import { Dropdown } from 'react-bootstrap'
import { MoreActionsDropdown } from '../MoreActionsDropdown'

beforeEach(() => {
  const rootNode = document.createElement('div')
  rootNode.id = 'root'
  document.body.appendChild(rootNode)
})

afterEach(() => {
  const rootNode = document.getElementById('root')
  document.body.removeChild(rootNode)
})

const setup = (overrideProps) => {
  const user = userEvent.setup()
  const props = {
    children: null,
    className: null,
    handoffLinks: [],
    ...overrideProps
  }

  render(
    <MoreActionsDropdown {...props} />
  )

  return {
    props,
    user
  }
}

describe('MoreActionsDropdown component', () => {
  test('renders nothing when no data is provided', () => {
    setup()
    expect(screen.queryByRole('button', { name: 'More actions' })).not.toBeInTheDocument()
  })

  test('renders correctly when handoff links are provided', async () => {
    const { user } = setup({
      handoffLinks: [{
        title: 'Giovanni',
        href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp'
      }]
    })

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'More actions' }))
    })

    expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Open collection in:' })).toBeInTheDocument()

    const snartHandoffLink = screen.getByRole('link', { name: 'Giovanni' })
    expect(snartHandoffLink).toBeInTheDocument()

    // Ensure that links can be selected with keys for coverage
    await user.type(snartHandoffLink, '{enter}')
  })

  test('renders correctly when children are provided', async () => {
    const { user } = setup({
      children: <Dropdown.Item>Toggle Visibility</Dropdown.Item>
    })

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'More actions' }))
    })

    expect(screen.getByRole('button', { name: 'Toggle Visibility' })).toBeInTheDocument()
  })

  test('renders correctly when children and handoff links are provided', async () => {
    const { user } = setup({
      children: <Dropdown.Item>Toggle Visibility</Dropdown.Item>,
      handoffLinks: [{
        title: 'Giovanni',
        href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp'
      }]
    })

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'More actions' }))
    })

    expect(screen.getByRole('button', { name: 'Toggle Visibility' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Giovanni' })).toBeInTheDocument()
  })
})
