import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Dz from 'dropzone'
import classNames from 'classnames'

import { eventEmitter } from '../../events/events'

export const withDropzone = (WrappedComponent) => {
  class WithDropzone extends Component {
    constructor(props) {
      super(props)
      this.state = {
        open: false
      }

      this.childRef = React.createRef()
      this.onSuccess = this.onSuccess.bind(this)
      this.onError = this.onError.bind(this)
      this.onRemovedFile = this.onRemovedFile.bind(this)
      this.onDragEnter = this.onDragEnter.bind(this)
      this.onDragLeave = this.onDragLeave.bind(this)
      this.onDrop = this.onDrop.bind(this)
      this.onSending = this.onSending.bind(this)
      this.onDropzoneOpen = this.onDropzoneOpen.bind(this)
    }

    componentDidMount() {
      const {
        dropzoneOptions,
        eventScope,
        onError,
        onRemovedFile
      } = this.props

      const { current } = this.childRef

      // eslint-disable-next-line react/no-find-dom-node
      const dzEl = ReactDOM.findDOMNode(current)

      window.addEventListener('dragenter', this.onDragEnter)

      Dz.autoDiscover = false
      this.dropzone = new Dz(dzEl, dropzoneOptions)
      this.dropzone.on('dragleave', this.onDragLeave)
      this.dropzone.on('drop', this.onDrop)
      this.dropzone.on('sending', this.onSending)
      this.dropzone.on('success', (file, response) => {
        this.onSuccess(file, response, this.dropzone)
      })
      if (onRemovedFile) this.dropzone.on('removedfile', this.onRemovedFile)
      if (onError) {
        this.dropzone.on('error', (file) => {
          this.onError(file)
        })
      }
      eventEmitter.on(`${eventScope}.dropzoneOpen`, this.onDropzoneOpen)
    }

    componentWillUnmount() {
      const {
        onError,
        onRemovedFile
      } = this.props

      window.removeEventListener('dragenter', this.onDragEnter)

      this.dropzone.off('dragleave', this.onDragLeave)
      this.dropzone.off('drop', this.onDrop)
      this.dropzone.off('sending', this.onSending)
      this.dropzone.off('success', this.onSuccess)
      if (onRemovedFile) this.dropzone.off('removedfile', this.onRemovedFile)
      if (onError) this.dropzone.off('error', this.onError)
    }

    onDropzoneOpen() {
      this.dropzone.hiddenFileInput.click()
    }

    onDragEnter() {
      const { onDragEnter } = this.props
      document.querySelector('body').classList.add('is-dragging')

      this.setState({
        open: true
      })

      if (onDragEnter) onDragEnter()
    }

    onDragLeave() {
      const { onDragLeave } = this.props
      document.querySelector('body').classList.remove('is-dragging')

      this.setState({
        open: false
      })

      if (onDragLeave) onDragLeave()
    }

    onDrop() {
      const { onDrop } = this.props
      document.querySelector('body').classList.remove('is-dragging')

      this.setState({
        open: false
      })

      if (onDrop) onDrop()
    }

    onSending(file, response, dropzone) {
      const { onSending } = this.props
      onSending(file, response, dropzone)
    }

    onSuccess(file, response, dropzone) {
      const { onSuccess } = this.props
      onSuccess(file, response, dropzone)
    }

    onError(file) {
      const { onError } = this.props
      if (onError) onError(file)
    }

    onRemovedFile() {
      const { onRemovedFile } = this.props
      if (onRemovedFile) onRemovedFile()
    }

    render() {
      const { className } = this.props
      const { open } = this.state
      const classes = classNames([
        'dropzone',
        {
          'dropzone--is-active': open
        },
        className
      ])
      return ReactDOM.createPortal(
        <WrappedComponent
          ref={this.childRef}
          className={classes}
        />,
        document.querySelector('body')
      )
    }
  }

  WithDropzone.defaultProps = {
    className: null,
    onError: null,
    onRemovedFile: null,
    onDrop: null,
    onDragEnter: null,
    onDragLeave: null,
    onSending: null
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
