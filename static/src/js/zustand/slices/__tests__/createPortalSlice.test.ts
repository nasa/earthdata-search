import useEdscStore from '../../useEdscStore'

describe('createPortalSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { portal } = zustandState

    expect(portal).toEqual({})
  })
})
