/**
 * Triggers a callback function if a specific key is pressed, preventing the shortcut in specific cases.
 * @param event The event object.
 * @param shortcutKey The key that should trigger the keyboard shortcut.
 * @param shortcutCallback The callback to call when the key is pressed.
 */
export const triggerKeyboardShortcut = ({
  event = {} as KeyboardEvent,
  shortcutKey = '',
  shortcutCallback
}: {
  event?: KeyboardEvent
  shortcutKey?: string
  shortcutCallback?: () => void
}) => {
  const {
    target: eventTarget = {} as HTMLElement,
    key: eventKey = '',
    type: eventType = ''
  } = event

  let { tagName = '' } = eventTarget as HTMLElement
  if (tagName) tagName = tagName.toLowerCase()

  // If an input is triggering the keydown, return
  if (tagName === 'input') return

  // If not triggered by a keydown event, return
  if (eventType !== 'keyup') return

  // If no key is defined, return
  if (eventKey !== shortcutKey) return

  // If the callback is not a valid callback, return
  if (typeof shortcutCallback !== 'function') return

  // Trigger the keyboard shortcut
  shortcutCallback()

  event.preventDefault()
  event.stopPropagation()
}

export default triggerKeyboardShortcut
