import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import {
  mapDispatchToProps,
  mapStateToProps,
  PortalLinkContainer
} from '../PortalLinkContainer'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'
import actions from '../../../actions'

import useEdscStore from '../../../zustand/useEdscStore'

const setup = setupTest({
  Component: PortalLinkContainer,
  defaultProps: {
    children: 'Click Here',
    className: 'test-class',
    match: {},
    label: '',
    location: {},
    history: {},
    onClick: jest.fn(),
    portal: {
      portalId: 'edsc'
    },
    newPortal: undefined,
    to: {
      pathname: '/search'
    },
    type: 'link',
    onChangePath: jest.fn()
  },
  defaultZustandState: {
    location: {
      navigate: jest.fn()
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

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      portal: {}
    }

    const expectedState = {
      portal: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
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
      overrideProps: {
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
          portal: {
            portalId: 'example'
          },
          to: '/search'
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
          portal: {
            portalId: 'edsc'
          },
          to: '/search?q=modis'
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

    const zustandState = useEdscStore.getState()
    const { location } = zustandState
    const { navigate } = location

    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith({
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
          portal: {
            portalId: 'example'
          },
          updatePath: true,
          onClick: null
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
          portal: {
            portalId: 'example'
          },
          updatePath: true
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
