import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import MapLayoutContainer from '../MapLayoutContainer'

describe('MapLayoutContainer', () => {
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
