import React from 'react'
import {
  screen,
  render,
  cleanup,
  within,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'

import ReactDOM from 'react-dom'
import { Dropdown } from 'react-bootstrap'
import { act } from 'react-dom/test-utils'
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

// https://github.com/testing-library/react-testing-library/issues/62#issuecomment-388395307
// Mock ReactDOM.createPortal to prevent any errors in the MoreActionsDropdown component
// jest.mock('react-dom', () => (
//   {
//     ...(jest.requireActual('react-dom')),
//     createPortal: jest.fn((children) => ({ children }))
//   }
// ))

// Mock `create-portal`
// jest.mock('react-dom', () => ({
//   ...(jest.requireActual('react-dom')),
//   createPortal: jest.fn((children) => (
//     <mock-smarthandoff data-testid="mock-smart-handoff">
//       {children}
//     </mock-smarthandoff>
//   ))
// }))

const setup = (overrideProps) => {
  const user = userEvent.setup()
  const props = {
    children: null,
    className: null,
    handoffLinks: [],
    ...overrideProps
  }

  const { container } = render(
    <MoreActionsDropdown {...props} />
  )

  return {
    container,
    props,
    user
  }
}

describe('MoreActionsDropdown component', () => {
  test('renders nothing when no data is provided', () => {
    setup()
    screen.debug()
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
    expect(screen.getByRole('link', { name: 'Giovanni' })).toBeInTheDocument()
    screen.debug()

    // // Query the document body directly for portal content
    // const portalContent = container.querySelector('[data-testid="portal-content"]');
    // expect(portalContent).toBeInTheDocument();
    // expect(portalContent).toHaveTextContent('Portal Content');

    //   console.log('🚀 ~ file: MoreActionsDropdown.test.js:83 ~ test.only ~ container:', container)
    //   const portalContent = container.querySelector('[title="Giovanni"]')
    //   expect(portalContent).toBeInTheDocument()
    // Screen.debug()

    // const { getByRole } = within(document.getElementById('root'))
    // // Await waitFor(() => {
    // //   screen.debug()
    // // })
    // const x = within(document.getElementById('root'))
    // console.log('🚀 ~ file: MoreActionsDropdown.test.js:88 ~ test.only ~ x:', x)

    // expect(getByRole('link')).toBeInTheDocument()

    // // Const { getByText } = within(rootNode)
    // // console.log(rootNode)
    // screen.debug()
    // const portalContent = screen.getByText('Portal Content')
    // expect(portalContent).toBeInTheDocument()
    // Screen.debug()
    // expect(rootNode).toContainElement(getByText(/Giovanni/i))

    // Expect(enzymeWrapper.find(Dropdown).length).toEqual(1)
    // expect(enzymeWrapper.find(Dropdown.Item).length).toEqual(1)
  })

  test.skip('renders correctly when children are provided', () => {
    const { enzymeWrapper } = setup({
      children: <Dropdown.Item>Toggle Visibility</Dropdown.Item>
    })

    expect(enzymeWrapper.find(Dropdown).length).toEqual(1)
    expect(enzymeWrapper.find(Dropdown.Item).length).toEqual(1)
  })

  test.skip('renders correctly when children and handoff links are provided', () => {
    const { enzymeWrapper } = setup({
      children: <Dropdown.Item>Toggle Visibility</Dropdown.Item>,
      handoffLinks: [{
        title: 'Giovanni',
        href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp'
      }]
    })

    expect(enzymeWrapper.find(Dropdown).length).toEqual(1)
    expect(enzymeWrapper.find(Dropdown.Item).length).toEqual(2)
  })
})
