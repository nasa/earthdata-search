import React, {
  useRef,
  useEffect,
  useState
} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Dz from 'dropzone'
import classNames from 'classnames'

import { eventEmitter } from '../../events/events'

export const withDropzone = (WrappedComponent) => {
  const WithDropzone = (props) => {
    const {
      className,
      eventScope,
      onSuccess,
      onError,
      onRemovedFile,
      onDragEnter,
      onDragLeave,
      onDrop,
      onSending,
      dropzoneOptions
    } = props

    const childRef = useRef(null)
    const dropzoneRef = useRef(null)
    const [open, setOpen] = useState(false)

    // Drag event handlers
    const handleDragEnter = () => {
      document.querySelector('body').classList.add('is-dragging')
      setOpen(true)
      if (onDragEnter) onDragEnter()
    }

    const handleDragLeave = () => {
      document.querySelector('body').classList.remove('is-dragging')
      setOpen(false)
      if (onDragLeave) onDragLeave()
    }

    const handleDrop = () => {
      document.querySelector('body').classList.remove('is-dragging')
      setOpen(false)
      if (onDrop) onDrop()
    }

    const handleSending = (file, response, dropzone) => {
      if (onSending) onSending(file, response, dropzone)
    }

    const handleSuccess = (file, response, dropzone) => {
      if (onSuccess) onSuccess(file, response, dropzone)
    }

    const handleError = (file) => {
      if (onError) onError(file)
    }

    const handleRemovedFile = () => {
      if (onRemovedFile) onRemovedFile()
    }

    const handleDropzoneOpen = () => {
      if (dropzoneRef.current && dropzoneRef.current.hiddenFileInput) {
        dropzoneRef.current.hiddenFileInput.click()
      }
    }

    useEffect(() => {
      // If the child component is mounted, setup Dropzone
      if (childRef.current) {
        const dropzoneElement = childRef.current.ref.current

        window.addEventListener('dragenter', handleDragEnter)

        // Create the Dropzone instance
        Dz.autoDiscover = false
        dropzoneRef.current = new Dz(dropzoneElement, dropzoneOptions)

        // Register event listeners
        dropzoneRef.current.on('dragleave', handleDragLeave)
        dropzoneRef.current.on('drop', handleDrop)
        dropzoneRef.current.on('sending', handleSending)
        dropzoneRef.current.on('success', (file, response) => {
          handleSuccess(file, response, dropzoneRef.current)
        })

        if (onRemovedFile) dropzoneRef.current.on('removedfile', handleRemovedFile)
        if (onError) dropzoneRef.current.on('error', handleError)

        eventEmitter.on(`${eventScope}.dropzoneOpen`, handleDropzoneOpen)
      }

      // Cleanup the event listeners
      return () => {
        window.removeEventListener('dragenter', handleDragEnter)

        dropzoneRef.current.off('dragleave', handleDragLeave)
        dropzoneRef.current.off('drop', handleDrop)
        dropzoneRef.current.off('sending', handleSending)
        dropzoneRef.current.off('success', handleSuccess)

        if (onRemovedFile) dropzoneRef.current.off('removedfile', handleRemovedFile)
        if (onError) dropzoneRef.current.off('error', handleError)
      }
    }, [])

    const classes = classNames([
      'dropzone',
      {
        'dropzone--is-active': open
      },
      className
    ])

    return ReactDOM.createPortal(
      <WrappedComponent
        ref={childRef}
        className={classes}
        {...props}
      />,
      document.querySelector('body')
    )
  }

  WithDropzone.propTypes = {
    className: PropTypes.string,
    eventScope: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onRemovedFile: PropTypes.func,
    onDragEnter: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDrop: PropTypes.func,
    onSending: PropTypes.func,
    dropzoneOptions: PropTypes.shape({}).isRequired
  }

  return WithDropzone
}

export default withDropzone
