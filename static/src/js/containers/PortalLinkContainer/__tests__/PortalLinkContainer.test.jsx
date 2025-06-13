import { screen } from '@testing-library/react'
import { useHistory } from 'react-router-dom'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { mapDispatchToProps, PortalLinkContainer } from '../PortalLinkContainer'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'
import actions from '../../../actions'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useHistory: jest.fn().mockReturnValue({
    push: jest.fn()
  })
}))

const setup = setupTest({
  Component: PortalLinkContainer,
  defaultProps: {
    children: 'Click Here',
    className: 'test-class',
    label: '',
    onClick: jest.fn(),
    newPortal: undefined,
    to: {
      pathname: '/search'
    },
    type: 'link',
    onChangePath: jest.fn()
  },
  defaultZustandState: {
    portal: {
      portalId: 'edsc'
    }
  },
  withRouter: true
})

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath(false)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(false)
  })
})

describe('PortalLinkContainer component', () => {
  beforeEach(() => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      defaultPortal: 'edsc'
    }))
  })

  test('should return a link with the default portal provided', () => {
    setup()

    const link = screen.getByRole('link', { name: 'Click Here' })
    expect(link).toHaveAttribute('class', 'test-class')
    expect(link).toHaveAttribute('type', 'link')
    expect(link).toHaveAttribute('href', '/search')
  })

  test('should return a link with a non-default portal provided', () => {
    setup({
      overrideZustandState: {
        portal: {
          portalId: 'example'
        }
      }
    })

    const link = screen.getByRole('link', { name: 'Click Here' })
    expect(link).toHaveAttribute('class', 'test-class')
    expect(link).toHaveAttribute('type', 'link')
    expect(link).toHaveAttribute('href', '/search?portal=example')
  })

  describe('when passing a string `to` link', () => {
    test('should return a link with a non-default portal', () => {
      setup({
        overrideProps: {
          to: '/search'
        },
        overrideZustandState: {
          portal: {
            portalId: 'example'
          }
        }
      })

      const link = screen.getByRole('link', { name: 'Click Here' })
      expect(link).toHaveAttribute('class', 'test-class')
      expect(link).toHaveAttribute('type', 'link')
      expect(link).toHaveAttribute('href', '/search?portal=example')
    })

    test('should return a link with search parameters', () => {
      setup({
        overrideProps: {
          to: '/search?q=modis'
        },
        overrideZustandState: {
          portal: {
            portalId: 'edsc'
          }
        }
      })

      const link = screen.getByRole('link', { name: 'Click Here' })
      expect(link).toHaveAttribute('class', 'test-class')
      expect(link).toHaveAttribute('type', 'link')
      expect(link).toHaveAttribute('href', '/search?q=modis')
    })
  })

  test('should return a button when the type is set', async () => {
    const { user } = setup({
      overrideProps: {
        type: 'button'
      }
    })

    const button = screen.getByRole('button', { name: 'Click Here' })
    expect(button).toHaveAttribute('class', 'button test-class btn')

    await user.click(button)

    expect(useHistory().push).toHaveBeenCalledTimes(1)
    expect(useHistory().push).toHaveBeenCalledWith({
      pathname: '/search',
      search: ''
    })
  })

  describe('when newPortal is provided', () => {
    test('should return a link when newPortal is set', () => {
      setup({
        overrideProps: {
          portal: {
            portalId: 'example'
          },
          newPortal: {
            portalId: 'anotherExample'
          }
        }
      })

      const link = screen.getByRole('link', { name: 'Click Here' })
      expect(link).toHaveAttribute('class', 'test-class')
      expect(link).toHaveAttribute('type', 'link')
      expect(link).toHaveAttribute('href', '/search?portal=anotherExample')
    })

    test('should return a link when newPortal is empty', () => {
      setup({
        overrideProps: {
          portal: {
            portalId: 'example'
          },
          newPortal: {}
        }
      })

      const link = screen.getByRole('link', { name: 'Click Here' })
      expect(link).toHaveAttribute('class', 'test-class')
      expect(link).toHaveAttribute('type', 'link')
      expect(link).toHaveAttribute('href', '/search')
    })
  })

  describe('when updatePath is true', () => {
    test('should call onChangePath', async () => {
      const { props, user } = setup({
        overrideProps: {
          updatePath: true,
          onClick: null
        },
        overrideZustandState: {
          portal: {
            portalId: 'example'
          }
        }
      })

      const link = screen.getByRole('link', { name: 'Click Here' })
      await user.click(link)

      expect(props.onChangePath).toHaveBeenCalledTimes(1)
      expect(props.onChangePath).toHaveBeenCalledWith('/search?portal=example')
    })

    test('should call the provided onClick and onChangePath', async () => {
      const { props, user } = setup({
        overrideProps: {
          updatePath: true
        },
        overrideZustandState: {
          portal: {
            portalId: 'example'
          }
        }
      })

      const link = screen.getByRole('link', { name: 'Click Here' })
      await user.click(link)

      expect(props.onClick).toHaveBeenCalledTimes(1)
      expect(props.onClick).toHaveBeenCalledWith(expect.objectContaining({
        type: 'click'
      }))

      expect(props.onChangePath).toHaveBeenCalledTimes(1)
      expect(props.onChangePath).toHaveBeenCalledWith('/search?portal=example')
    })
  })
})
