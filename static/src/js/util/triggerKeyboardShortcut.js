/**
 * Triggers a callback function if a specific key is pressed, preventing the shortcut in specific cases.
 * @param {Object} event The event object.
 * @param {String} shortcutKey The key that should trigger the keyboard shortcut.
 * @param {Function} shortcutCallback The callback to call when the key is pressed.
 */
export const triggerKeyboardShortcut = ({
  event = {},
  shortcutKey = '',
  shortcutCallback
}) => {
  const {
    target: eventTarget = {},
    key: eventKey = '',
    type: eventType = ''
  } = event

  let { tagName = '' } = eventTarget
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
