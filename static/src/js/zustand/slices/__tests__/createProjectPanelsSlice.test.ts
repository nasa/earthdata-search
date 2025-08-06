import useEdscStore from '../../useEdscStore'

describe('createProjectPanelsSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { projectPanels } = zustandState

    expect(projectPanels).toEqual({
      panels: {
        isOpen: true,
        activePanel: '0.0.0'
      },
      setIsOpen: expect.any(Function),
      setActivePanel: expect.any(Function),
      setPanelGroup: expect.any(Function),
      setPanelSection: expect.any(Function)
    })
  })

  describe('setIsOpen', () => {
    test('updates isOpen', () => {
      const zustandState = useEdscStore.getState()
      const { projectPanels } = zustandState
      const { setIsOpen } = projectPanels
      setIsOpen(false)

      const updatedState = useEdscStore.getState()
      expect(updatedState.projectPanels.panels.isOpen).toBe(false)
    })
  })

  describe('setActivePanel', () => {
    test('updates activePanel', () => {
      const zustandState = useEdscStore.getState()
      const { projectPanels } = zustandState
      const { setActivePanel } = projectPanels
      setActivePanel('1.2.3')

      const updatedState = useEdscStore.getState()
      expect(updatedState.projectPanels.panels.activePanel).toBe('1.2.3')
    })
  })

  describe('setPanelGroup', () => {
    test('updates the group part of activePanel', () => {
      const zustandState = useEdscStore.getState()
      const { projectPanels } = zustandState
      const { setPanelGroup } = projectPanels
      const initialState = useEdscStore.getInitialState()

      useEdscStore.setState({
        projectPanels: {
          ...initialState.projectPanels,
          panels: {
            isOpen: true,
            activePanel: '1.2.3'
          }
        }
      })

      setPanelGroup('5')

      const updatedState = useEdscStore.getState()
      expect(updatedState.projectPanels.panels.activePanel).toBe('1.5.3')
    })
  })

  describe('setPanelSection', () => {
    test('updates the section part of activePanel', () => {
      const zustandState = useEdscStore.getState()
      const { projectPanels } = zustandState
      const { setPanelSection } = projectPanels
      const initialState = useEdscStore.getInitialState()

      useEdscStore.setState({
        projectPanels: {
          ...initialState.projectPanels,
          panels: {
            isOpen: true,
            activePanel: '1.2.3'
          }
        }
      })

      setPanelSection('7')

      const updatedState = useEdscStore.getState()
      expect(updatedState.projectPanels.panels.activePanel).toBe('7.2.3')
    })
  })
})
