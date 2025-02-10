// eslint-disable-next-line max-classes-per-file
import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import {
  render,
  cleanup,
  waitFor
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import MapLayoutContainer from '../MapLayoutContainer'

describe('MapLayoutContainer', () => {
  let mutationObserverInstances = []
  let resizeObserverInstances = []

  beforeEach(() => {
    const sidebar = document.createElement('div')
    sidebar.className = 'sidebar'
    sidebar.getBoundingClientRect = () => ({
      width: 100,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    })

    document.body.appendChild(sidebar)

    const panels = document.createElement('div')
    panels.className = 'panels panels--is-open'
    panels.getBoundingClientRect = () => ({
      width: 200,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    })

    document.body.appendChild(panels)

    mutationObserverInstances = []
    resizeObserverInstances = []

    global.MutationObserver = class {
      constructor(callback) {
        this.callback = callback
        this.disconnect = jest.fn()
        mutationObserverInstances.push(this)
      }

      observe() {
        /* No-op */
      }
    }

    // Mock ResizeObserver
    global.ResizeObserver = class {
      constructor(callback) {
        this.callback = callback
        this.disconnect = jest.fn()
        resizeObserverInstances.push(this)
      }

      observe() {
        /* No-op */
      }
    }
  })

  afterEach(() => {
    cleanup()

    document.body.innerHTML = ''
    jest.restoreAllMocks()
  })

  test('updates map offset when a mutation with attribute "class" is observed', async () => {
    const panelsRef = React.createRef()
    const { container } = render(
      <MapLayoutContainer panelsRef={panelsRef}>
        <div>Side Panel</div>
        <div>Map Component</div>
      </MapLayoutContainer>
    )

    const containerDiv = container.querySelector('.map-layout-container')
    expect(containerDiv).toHaveStyle('--map-offset: 300px')

    const sidebarEl = document.querySelector('.sidebar')
    sidebarEl.getBoundingClientRect = () => ({
      width: 150,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    })

    mutationObserverInstances.forEach((observer) => {
      observer.callback([{ attributeName: 'class' }])
    })

    await waitFor(() => {
      expect(containerDiv).toHaveStyle('--map-offset: 350px')
    })
  })

  test('cleans up observers and event listeners on unmount', () => {
    const panelsRef = React.createRef()
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

    const { unmount } = render(
      <MapLayoutContainer panelsRef={panelsRef}>
        <div>Side Panel</div>
        <div>Map Component</div>
      </MapLayoutContainer>
    )

    unmount()

    mutationObserverInstances.forEach((observer) => {
      expect(observer.disconnect).toHaveBeenCalled()
    })

    resizeObserverInstances.forEach((observer) => {
      expect(observer.disconnect).toHaveBeenCalled()
    })

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  test('clones direct SidebarContainer child with panelsRef', () => {
    const panelsRef = React.createRef()

    const SidebarContainer = forwardRef((props, ref) => <div ref={ref}>Sidebar</div>)
    SidebarContainer.displayName = 'SidebarContainer'

    const { getByText } = render(
      <MapLayoutContainer panelsRef={panelsRef}>
        <SidebarContainer />
        <div>Map Component</div>
      </MapLayoutContainer>
    )

    const sidebarElement = getByText('Sidebar')
    expect(panelsRef.current).toBe(sidebarElement)
  })

  test('clones nested SidebarContainer child with panelsRef', () => {
    const panelsRef = React.createRef()
    const SidebarContainer = forwardRef((props, ref) => <div ref={ref}>Nested Sidebar</div>)
    SidebarContainer.displayName = 'SidebarContainer'

    const ParentComponent = ({ children }) => <div>{children}</div>
    ParentComponent.propTypes = {
      children: PropTypes.node.isRequired
    }

    const { getByText } = render(
      <MapLayoutContainer panelsRef={panelsRef}>
        <ParentComponent>
          <SidebarContainer />
        </ParentComponent>
        <div>Map Component</div>
      </MapLayoutContainer>
    )

    const nestedSidebar = getByText('Nested Sidebar')
    expect(panelsRef.current).toBe(nestedSidebar)
  })

  test('returns child unmodified if not a SidebarContainer', () => {
    const panelsRef = React.createRef()
    const NonSidebar = () => <div>Non Sidebar</div>

    const { getByText } = render(
      <MapLayoutContainer panelsRef={panelsRef}>
        <NonSidebar />
        <div>Map Component</div>
      </MapLayoutContainer>
    )

    expect(getByText('Non Sidebar')).toBeTruthy()
  })
})
