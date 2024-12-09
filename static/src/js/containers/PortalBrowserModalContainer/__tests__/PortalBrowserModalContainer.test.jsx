import React from 'react'
import { render } from '@testing-library/react'

import actions from '../../../actions'

jest.mock('../../../components/PortalBrowserModal/PortalBrowserModal', () => ({
  PortalBrowserModal: jest.fn(({ children }) => (
    <mock-PortalBrowserModal data-testid="PortalBrowserModal">
      {children}
    </mock-PortalBrowserModal>
  ))
}))

import {
  PortalBrowserModalContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../PortalBrowserModalContainer'
import { PortalBrowserModal } from '../../../components/PortalBrowserModal/PortalBrowserModal'

describe('mapDispatchToProps', () => {
  test('onTogglePortalBrowserModal calls actions.togglePortalBrowserModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'togglePortalBrowserModal')

    mapDispatchToProps(dispatch).onTogglePortalBrowserModal({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      ui: {
        portalBrowserModal: {
          isOpen: false
        }
      }
    }

    const expectedState = {
      isOpen: false
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('PortalBrowserModalContainer component', () => {
  test('passes its props and renders a single FacetsModal component', () => {
    const isOpen = true
    const onTogglePortalBrowserModal = jest.fn()
    render(
      <PortalBrowserModalContainer
        isOpen={isOpen}
        location={{}}
        onTogglePortalBrowserModal={onTogglePortalBrowserModal}
      />
    )

    expect(PortalBrowserModal).toHaveBeenCalledTimes(1)
    expect(PortalBrowserModal).toHaveBeenCalledWith({
      isOpen,
      location: {},
      onTogglePortalBrowserModal
    }, {})
  })
})
