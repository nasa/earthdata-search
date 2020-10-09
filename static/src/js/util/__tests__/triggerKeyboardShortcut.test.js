import { triggerKeyboardShortcut } from '../triggerKeyboardShortcut'

describe('triggerKeyboardShortcut', () => {
  describe('if the event target is not defined', () => {
    test('does not trigger the shortcut', () => {
      const callbackMock = jest.fn()

      triggerKeyboardShortcut({
        shortcutKey: 'a',
        shortcutCallback: callbackMock
      })

      expect(callbackMock).toHaveBeenCalledTimes(0)
    })
  })

  describe('if the event tagName is not defined', () => {
    test('does not trigger the shortcut', () => {
      const callbackMock = jest.fn()

      triggerKeyboardShortcut({
        event: {
          target: {}
        },
        shortcutKey: 'a',
        shortcutCallback: callbackMock
      })

      expect(callbackMock).toHaveBeenCalledTimes(0)
    })
  })

  describe('if the keyup event is triggered in an input', () => {
    test('does not trigger the shortcut', () => {
      const callbackMock = jest.fn()
      const preventDefaultMock = jest.fn()
      const stopPropagationMock = jest.fn()

      triggerKeyboardShortcut({
        event: {
          target: {
            tagName: 'input'
          },
          key: 'a',
          type: 'keyup',
          preventDefault: preventDefaultMock,
          stopPropagation: stopPropagationMock
        },
        shortcutKey: 'a',
        shortcutCallback: callbackMock
      })

      expect(callbackMock).toHaveBeenCalledTimes(0)
      expect(preventDefaultMock).toHaveBeenCalledTimes(0)
      expect(stopPropagationMock).toHaveBeenCalledTimes(0)
    })
  })

  describe('if the assigned to a keydown event', () => {
    test('does not trigger the shortcut', () => {
      const callbackMock = jest.fn()
      const preventDefaultMock = jest.fn()
      const stopPropagationMock = jest.fn()

      triggerKeyboardShortcut({
        event: {
          target: {
            tagName: 'body'
          },
          key: 'a',
          type: 'keydown',
          preventDefault: preventDefaultMock,
          stopPropagation: stopPropagationMock
        },
        shortcutKey: 'a',
        shortcutCallback: callbackMock
      })

      expect(callbackMock).toHaveBeenCalledTimes(0)
      expect(preventDefaultMock).toHaveBeenCalledTimes(0)
      expect(stopPropagationMock).toHaveBeenCalledTimes(0)
    })
  })

  describe('if the assigned to a keydown event', () => {
    test('does not trigger the shortcut', () => {
      const callbackMock = jest.fn()
      const preventDefaultMock = jest.fn()
      const stopPropagationMock = jest.fn()

      triggerKeyboardShortcut({
        event: {
          target: {
            tagName: 'body'
          },
          key: 'a',
          type: 'keydown',
          preventDefault: preventDefaultMock,
          stopPropagation: stopPropagationMock
        },
        shortcutKey: 'a',
        shortcutCallback: callbackMock
      })

      expect(callbackMock).toHaveBeenCalledTimes(0)
      expect(preventDefaultMock).toHaveBeenCalledTimes(0)
      expect(stopPropagationMock).toHaveBeenCalledTimes(0)
    })
  })

  describe('if assigned to a keyup', () => {
    describe('and the key does not match', () => {
      test('does not trigger the shortcut', () => {
        const callbackMock = jest.fn()
        const preventDefaultMock = jest.fn()
        const stopPropagationMock = jest.fn()

        triggerKeyboardShortcut({
          event: {
            target: {
              tagName: 'body'
            },
            key: 'b',
            type: 'keyup',
            preventDefault: preventDefaultMock,
            stopPropagation: stopPropagationMock
          },
          shortcutKey: 'a',
          shortcutCallback: callbackMock
        })

        expect(callbackMock).toHaveBeenCalledTimes(0)
        expect(preventDefaultMock).toHaveBeenCalledTimes(0)
        expect(stopPropagationMock).toHaveBeenCalledTimes(0)
      })
    })

    describe('and the key matches', () => {
      test('triggers the shortcut', () => {
        const callbackMock = jest.fn()
        const preventDefaultMock = jest.fn()
        const stopPropagationMock = jest.fn()

        triggerKeyboardShortcut({
          event: {
            target: {
              tagName: 'body'
            },
            key: 'a',
            type: 'keyup',
            preventDefault: preventDefaultMock,
            stopPropagation: stopPropagationMock
          },
          shortcutKey: 'a',
          shortcutCallback: callbackMock
        })

        expect(callbackMock).toHaveBeenCalledTimes(1)
        expect(preventDefaultMock).toHaveBeenCalledTimes(1)
        expect(stopPropagationMock).toHaveBeenCalledTimes(1)
      })
    })
  })
})
