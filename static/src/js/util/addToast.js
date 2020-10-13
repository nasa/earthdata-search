/**
 * @name addToast
 * @param {React.Node} content
 * @param {object} options Toast props for the notification
 * @see https://github.com/jossmac/react-toast-notifications#toast-props
 * @description Renders a toast notification.
 */
const addToast = (content, options) => {
  try {
    // the add method referenced from the ToastProvider in App.js
    const { add } = window.reactToastProvider.current
    if (add) {
      add(content, options)
      return
    }
  } catch (error) {
    console.error(error)
    return
  }
  console.error('Add toast method not available.')
}

export default addToast
