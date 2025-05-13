import './mapButton.scss'

/**
 * Creats a button element with the provided class name and title
 * and adds Bootstrap tooltip attributes to it.
 * @param {Object} params
 * @param {HTMLElement} params.button - The button element to use (optional)
 * @param {string} params.className - The class name to add to the button
 * @param {string} params.title - The title of the button
 * @param {boolean} params.tooltip - Whether to add a tooltip to the button (default: true)
 * @returns {HTMLElement} The button element
 */
const mapButton = ({
  button,
  className,
  title,
  tooltip = true
}: {
  /** The button element to use (optional) */
  button?: HTMLButtonElement | null;
  /** The class name to add to the button */
  className?: string;
  /** The title of the button */
  title: string;
  /** Whether to add a tooltip to the button (default: true) */
  tooltip?: boolean
}): HTMLButtonElement => {
  let buttonToReturn = button

  // If the button is not provided, create a new button element
  if (!buttonToReturn) {
    buttonToReturn = document.createElement('button')
  }

  // Set the button attributes
  buttonToReturn.className = `map-button d-block border-0 bg-white ${className}`
  buttonToReturn.ariaLabel = title
  buttonToReturn.title = title

  // Add Bootstrap tooltip attributes if tooltip is enabled
  if (tooltip) {
    buttonToReturn.setAttribute('data-bs-toggle', 'tooltip')
    buttonToReturn.setAttribute('data-bs-title', title)
    buttonToReturn.setAttribute('data-bs-placement', 'left')
  }

  return buttonToReturn
}

export default mapButton
