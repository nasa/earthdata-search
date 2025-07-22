import useEdscStore from '../../useEdscStore'

describe('createPanelsSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { panels } = zustandState

    expect(panels).toEqual({
      isOpen: true,
      activePanel: '0.0.0',
      setIsOpen: expect.any(Function),
      setActivePanel: expect.any(Function),
      setPanelGroup: expect.any(Function),
      setPanelSection: expect.any(Function)
    })
  })

  describe('setIsOpen', () => {
    test('updates isOpen', () => {
      const zustandState = useEdscStore.getState()
      const { panels } = zustandState
      const { setIsOpen } = panels
      setIsOpen(false)

      const updatedState = useEdscStore.getState()
      expect(updatedState.panels.isOpen).toBe(false)
    })
  })

  describe('setActivePanel', () => {
    test('updates activePanel', () => {
      const zustandState = useEdscStore.getState()
      const { panels } = zustandState
      const { setActivePanel } = panels
      setActivePanel('1.2.3')

      const updatedState = useEdscStore.getState()
      expect(updatedState.panels.activePanel).toBe('1.2.3')
    })
  })

  describe('setPanelGroup', () => {
    test('updates the group part of activePanel', () => {
      const zustandState = useEdscStore.getState()
      const { panels } = zustandState
      const { setActivePanel, setPanelGroup } = panels
      setActivePanel('1.2.3')
      setPanelGroup('5')

      const updatedState = useEdscStore.getState()
      expect(updatedState.panels.activePanel).toBe('1.5.3')
    })
  })

  describe('setPanelSection', () => {
    test('updates the section part of activePanel', () => {
      const zustandState = useEdscStore.getState()
      const { panels } = zustandState
      const { setActivePanel, setPanelSection } = panels
      setActivePanel('1.2.3')
      setPanelSection('7')

      const updatedState = useEdscStore.getState()
      expect(updatedState.panels.activePanel).toBe('7.2.3')
    })
  })
})
