import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isFunction } from 'lodash'

import { FaRegCopy } from 'react-icons/fa'

import Button from '../Button/Button'
import { addToast } from '../../util/addToast'

import './CopyableText.scss'

/**
 * Copies the text to the clipboard and optionally displays success/failure toast elements.
 * @param {Object} arg0 - The arguments.
 * @param {String|Function} arg0.failureMessage - The string to display if the browser does not support copy.
 * @param {String|Function} arg0.successMessage - The string to display if the browser supports copy.
 * @param {String} arg0.text - The text to display. This text will be copied by default.
 * @param {String|Function} arg0.textToCopy - Overrides the text that is copied. If provided a function, the return value will be displayed.
 */
const copyStringToClipBoard = async ({
  failureMessage,
  successMessage,
  text,
  textToCopy
}) => {
  let successText = ''
  let failureText = ''
  let clipboardText = text

  if (isFunction(successMessage)) {
    successText = successMessage({ text })
  } else {
    successText = successMessage
  }

  if (isFunction(failureMessage)) {
    failureText = failureMessage({ text })
  } else {
    failureText = failureMessage
  }

  if (textToCopy) {
    if (isFunction(textToCopy)) {
      clipboardText = textToCopy({ text })
    } else {
      clipboardText = textToCopy
    }
  }

  try {
    await navigator.clipboard.writeText(clipboardText)

    if (successText) {
      addToast(successText, {
        appearance: 'success',
        autoDismiss: true
      })
    }
  } catch (err) {
    if (failureText) {
      addToast(failureText, {
        appearance: 'error',
        autoDismiss: true
      })
    }
  }
}

/**
 * Renders CopyableText.
 * @param {Object} props - The props passed into the component.
 * @param {String} arg0.className - The button classname.
 * @param {String|Function} arg0.failureMessage - The string to display if the browser does not support copy.
 * @param {String} arg0.label - The label to display on the button.
 * @param {Function} arg0.onClick - An callback that fires on click.
 * @param {String|Function} arg0.successMessage - The string to display if the browser supports copy.
 * @param {String} arg0.text - The text to display. This text will be copied by default.
 * @param {String|Function} arg0.textToCopy - Overrides the text that is copied. If provided a function, the return value will be displayed.
 */
export const CopyableText = ({
  className,
  failureMessage,
  label,
  onClick,
  successMessage,
  text,
  textToCopy
}) => {
  const classes = classNames([
    'copyable-text',
    className
  ])

  return (
    <Button
      variant="naked"
      className={classes}
      onClick={(e) => {
        e.stopPropagation()

        copyStringToClipBoard({
          failureMessage,
          successMessage,
          text,
          textToCopy
        })
        if (onClick) onClick(e)
      }}
      label={label}
      icon={FaRegCopy}
      iconPosition="right"
    >
      {text}
    </Button>
  )
}

CopyableText.defaultProps = {
  className: '',
  label: 'Copy text to clipboard',
  onClick: null,
  successMessage: '',
  failureMessage: '',
  textToCopy: ''
}

CopyableText.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  successMessage: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  failureMessage: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  text: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]).isRequired,
  textToCopy: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ])
}

export default CopyableText
