import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('../PanelSection', () => ({
  PanelSection: jest.fn(({ children }) => (
    <mock-PanelSection data-testid="PanelSection">
      {children}
    </mock-PanelSection>
  ))
}))
jest.mock('../PanelGroup', () => ({
  PanelGroup: jest.fn(({ children }) => (
    <mock-PanelGroup data-testid="PanelGroup">
      {children}
    </mock-PanelGroup>
  ))
}))
jest.mock('../PanelItem', () => ({
  PanelItem: jest.fn(({ children }) => (
    <mock-PanelItem data-testid="PanelItem">
      {children}
    </mock-PanelItem>
  ))
}))

import Panels from '../Panels'
import { PanelSection } from '../PanelSection'
import { PanelGroup } from '../PanelGroup'
import { PanelItem } from '../PanelItem'

const setup = (renderMethod, overrideProps = {}) => {
  const props = {
    show: true,
    activePanel: '0.0.0',
    draggable: true,
    onPanelClose: jest.fn(),
    onPanelOpen: jest.fn(),
    onChangePanel: jest.fn(),
    ...overrideProps
  }

  return renderMethod(
    <Panels {...props}>
      <PanelSection>
        <PanelGroup
          primaryHeading="Panel Group 0.0"
          footer={<div className="footer">A group footer</div>}
        >
          <PanelItem>
            Panel 0.0.0 Content
          </PanelItem>
          <PanelItem>
            Panel 0.0.1 Content
          </PanelItem>
        </PanelGroup>
        <PanelGroup
          primaryHeading="Panel Group 0.1"
          footer={<div className="footer">Another group footer</div>}
        >
          <PanelItem hideFooter>
            Panel 0.1.0 Content
          </PanelItem>
        </PanelGroup>
      </PanelSection>
      <PanelSection>
        <PanelGroup
          primaryHeading="Panel Group 1.0"
          footer={<div className="footer">A group footer</div>}
        >
          <PanelItem footer={<div className="fake-footer">A fake footer</div>}>
            Panel 1.0.0 Content
          </PanelItem>
          <PanelItem>
            Panel 1.0.1 Content
          </PanelItem>
        </PanelGroup>
        <PanelGroup
          primaryHeading="Panel Group 1.1"
        >
          <PanelItem>
            Panel 1.1.0 Content
          </PanelItem>
          <PanelItem>
            Panel 1.1.1 Content
          </PanelItem>
        </PanelGroup>
      </PanelSection>
    </Panels>
  )
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Panels component', () => {
  test('renders itself and its children correctly', () => {
    setup(render)

    expect(screen.getByTestId('panels-section')).toHaveStyle('width: 600px;')

    // Panels is re-rendered after the width has been determined, so we want to check the last calls to the children components
    expect(PanelSection).toHaveBeenCalledTimes(4)
    expect(PanelSection).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        isActive: true,
        isOpen: true,
        panelSectionId: '0'
      }),
      {}
    )
    expect(PanelSection).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        isActive: false,
        isOpen: false,
        panelSectionId: '1'
      }),
      {}
    )

    expect(PanelGroup).toHaveBeenCalledTimes(8)
    expect(PanelGroup).toHaveBeenNthCalledWith(
      5,
      expect.objectContaining({
        activePanelId: '0',
        isActive: true,
        isOpen: true,
        panelGroupId: '0',
        primaryHeading: 'Panel Group 0.0'
      }),
      {}
    )
    expect(PanelGroup).toHaveBeenNthCalledWith(
      6,
      expect.objectContaining({
        activePanelId: '0',
        isActive: false,
        isOpen: false,
        panelGroupId: '1',
        primaryHeading: 'Panel Group 0.1'
      }),
      {}
    )
    expect(PanelGroup).toHaveBeenNthCalledWith(
      7,
      expect.objectContaining({
        activePanelId: '0',
        isActive: false,
        isOpen: false,
        panelGroupId: '0',
        primaryHeading: 'Panel Group 1.0'
      }),
      {}
    )
    expect(PanelGroup).toHaveBeenNthCalledWith(
      8,
      expect.objectContaining({
        activePanelId: '0',
        isActive: false,
        isOpen: false,
        panelGroupId: '1',
        primaryHeading: 'Panel Group 1.1'
      }),
      {}
    )

    expect(PanelItem).toHaveBeenCalledTimes(7)
    expect(PanelItem).toHaveBeenNthCalledWith(
      1,
      { children: 'Panel 0.0.0 Content' },
      {}
    )
    expect(PanelItem).toHaveBeenNthCalledWith(
      2,
      { children: 'Panel 0.0.1 Content' },
      {}
    )
    expect(PanelItem).toHaveBeenNthCalledWith(
      3,
      {
        children: 'Panel 0.1.0 Content',
        hideFooter: true
      },
      {}
    )
    expect(PanelItem).toHaveBeenNthCalledWith(
      4,
      {
        children: 'Panel 1.0.0 Content',
        footer: <div className="fake-footer">A fake footer</div>
      },
      {}
    )
    expect(PanelItem).toHaveBeenNthCalledWith(
      5,
      { children: 'Panel 1.0.1 Content' },
      {}
    )
    expect(PanelItem).toHaveBeenNthCalledWith(
      6,
      { children: 'Panel 1.1.0 Content' },
      {}
    )
    expect(PanelItem).toHaveBeenNthCalledWith(
      7,
      { children: 'Panel 1.1.1 Content' },
      {}
    )
  })

  describe('After switching a panel section', () => {
    test('renders the panels correctly', () => {
      const { rerender } = setup(render)

      setup(rerender, { activePanel: '1.0.0' })

      // Panels is re-rendered after the props have changed, so we want to check the last calls to the children components
      expect(PanelSection).toHaveBeenCalledTimes(6)
      expect(PanelSection).toHaveBeenNthCalledWith(
        5,
        expect.objectContaining({
          isActive: false,
          isOpen: false,
          panelSectionId: '0'
        }),
        {}
      )
      expect(PanelSection).toHaveBeenNthCalledWith(
        6,
        expect.objectContaining({
          isActive: true,
          isOpen: true,
          panelSectionId: '1'
        }),
        {}
      )

      expect(PanelGroup).toHaveBeenCalledTimes(12)
      expect(PanelGroup).toHaveBeenNthCalledWith(
        9,
        expect.objectContaining({
          activePanelId: '0',
          isActive: false,
          isOpen: false,
          panelGroupId: '0',
          primaryHeading: 'Panel Group 0.0'
        }),
        {}
      )
      expect(PanelGroup).toHaveBeenNthCalledWith(
        10,
        expect.objectContaining({
          activePanelId: '0',
          isActive: false,
          isOpen: false,
          panelGroupId: '1',
          primaryHeading: 'Panel Group 0.1'
        }),
        {}
      )
      expect(PanelGroup).toHaveBeenNthCalledWith(
        11,
        expect.objectContaining({
          activePanelId: '0',
          isActive: true,
          isOpen: true,
          panelGroupId: '0',
          primaryHeading: 'Panel Group 1.0'
        }),
        {}
      )
      expect(PanelGroup).toHaveBeenNthCalledWith(
        12,
        expect.objectContaining({
          activePanelId: '0',
          isActive: false,
          isOpen: false,
          panelGroupId: '1',
          primaryHeading: 'Panel Group 1.1'
        }),
        {}
      )
    })
  })

  describe('After switching a panel group', () => {
    test('renders the panels correctly', () => {
      const { rerender } = setup(render)

      setup(rerender, { activePanel: '0.1.0' })

      // Panels is re-rendered after the props have changed, so we want to check the last calls to the children components
      expect(PanelSection).toHaveBeenCalledTimes(6)
      expect(PanelSection).toHaveBeenNthCalledWith(
        5,
        expect.objectContaining({
          isActive: true,
          isOpen: true,
          panelSectionId: '0'
        }),
        {}
      )
      expect(PanelSection).toHaveBeenNthCalledWith(
        6,
        expect.objectContaining({
          isActive: false,
          isOpen: false,
          panelSectionId: '1'
        }),
        {}
      )

      expect(PanelGroup).toHaveBeenCalledTimes(12)
      expect(PanelGroup).toHaveBeenNthCalledWith(
        9,
        expect.objectContaining({
          activePanelId: '0',
          isActive: false,
          isOpen: false,
          panelGroupId: '0',
          primaryHeading: 'Panel Group 0.0'
        }),
        {}
      )
      expect(PanelGroup).toHaveBeenNthCalledWith(
        10,
        expect.objectContaining({
          activePanelId: '0',
          isActive: true,
          isOpen: true,
          panelGroupId: '1',
          primaryHeading: 'Panel Group 0.1'
        }),
        {}
      )
      expect(PanelGroup).toHaveBeenNthCalledWith(
        11,
        expect.objectContaining({
          activePanelId: '0',
          isActive: false,
          isOpen: false,
          panelGroupId: '0',
          primaryHeading: 'Panel Group 1.0'
        }),
        {}
      )
      expect(PanelGroup).toHaveBeenNthCalledWith(
        12,
        expect.objectContaining({
          activePanelId: '0',
          isActive: false,
          isOpen: false,
          panelGroupId: '1',
          primaryHeading: 'Panel Group 1.1'
        }),
        {}
      )
    })
  })

  describe('After switching a panel item', () => {
    test('renders the panels correctly', () => {
      const { rerender } = setup(render)

      setup(rerender, { activePanel: '0.0.1' })

      // Panels is re-rendered after the props have changed, so we want to check the last calls to the children components
      expect(PanelSection).toHaveBeenCalledTimes(6)
      expect(PanelSection).toHaveBeenNthCalledWith(
        5,
        expect.objectContaining({
          isActive: true,
          isOpen: true,
          panelSectionId: '0'
        }),
        {}
      )
      expect(PanelSection).toHaveBeenNthCalledWith(
        6,
        expect.objectContaining({
          isActive: false,
          isOpen: false,
          panelSectionId: '1'
        }),
        {}
      )

      expect(PanelGroup).toHaveBeenCalledTimes(12)
      expect(PanelGroup).toHaveBeenNthCalledWith(
        9,
        expect.objectContaining({
          activePanelId: '1',
          isActive: true,
          isOpen: true,
          panelGroupId: '0',
          primaryHeading: 'Panel Group 0.0'
        }),
        {}
      )
      expect(PanelGroup).toHaveBeenNthCalledWith(
        10,
        expect.objectContaining({
          activePanelId: '1',
          isActive: false,
          isOpen: false,
          panelGroupId: '1',
          primaryHeading: 'Panel Group 0.1'
        }),
        {}
      )
      expect(PanelGroup).toHaveBeenNthCalledWith(
        11,
        expect.objectContaining({
          activePanelId: '1',
          isActive: false,
          isOpen: false,
          panelGroupId: '0',
          primaryHeading: 'Panel Group 1.0'
        }),
        {}
      )
      expect(PanelGroup).toHaveBeenNthCalledWith(
        12,
        expect.objectContaining({
          activePanelId: '1',
          isActive: false,
          isOpen: false,
          panelGroupId: '1',
          primaryHeading: 'Panel Group 1.1'
        }),
        {}
      )
    })
  })

  describe('After closing the panel', () => {
    test('updates the state', () => {
      const { rerender } = setup(render)

      setup(rerender, { show: false })

      expect(screen.getByTestId('panels-section')).not.toHaveClass('panels--is-open')
    })
  })
})
