/**
 * @name addToast
 * @param {React.Node} content
 * @param {object} options Toast props for the notification
 * @see https://github.com/jossmac/react-toast-notifications#toast-props
 * @description Renders a toast notification.
 */
export const addToast = (content, options) => {
  try {
    // the add method referenced from the ToastProvider in App.js
    const { add } = window.reactToastProvider.current
    if (!add) {
      console.error('Add toast method not available.')
      return
    }

    add(content, options)
  } catch (error) {
    console.error(error)
  }
}

export default addToast
