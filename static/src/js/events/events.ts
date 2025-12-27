import EventEmitter from 'events'

class CustomEventEmitter extends EventEmitter {
  /**
   * A buffer to hold events until their listeners are ready
   */
  eventBuffer: {
    [eventName: string]: Array<{
      args: unknown[]
    }>
  }

  /**
   * Tracks whether listeners are ready for each event
   */
  isListenerReady: {
    [eventName: string]: boolean
  }

  constructor() {
    super()

    this.eventBuffer = {}
    this.isListenerReady = {}
  }

  /**
   * Emit an event, buffering it if no listeners are ready
   * @param eventName The name of the event to emit
   * @param args The arguments to pass with the event
   */
  emitBuffered(eventName: string, ...args: unknown[]) {
    if (this.isListenerReady[eventName]) {
      // If the listener is ready, emit the event immediately
      this.emit(eventName, ...args)
    } else {
      // If the listener is not ready, buffer the event

      // Initialize the buffer for this event if it doesn't exist
      this.eventBuffer[eventName] = this.eventBuffer[eventName] || []

      // Store the event and its arguments
      this.eventBuffer[eventName].push({
        args
      })
    }
  }

  /**
   * Mark a listener as ready and process any buffered events
   * @param eventName The name of the event whose listener is ready
   */
  setListenerReady(eventName: string) {
    // Mark the listener as ready
    this.isListenerReady[eventName] = true

    // Process the buffer
    while (this.eventBuffer[eventName] && this.eventBuffer[eventName].length > 0) {
      const event = this.eventBuffer[eventName].shift()

      if (event) {
        setTimeout(() => {
          this.emit(eventName, ...event.args)
        }, 0)
      }
    }
  }
}

const emitter = new CustomEventEmitter()

// Map granules can consume a ton of listeners, so prevent any console errors.
emitter.setMaxListeners(0)

emitter.on('error.global', (error = true) => {
  const { body } = document
  if (error) {
    body.classList.add('body--has-error')
  } else {
    body.classList.remove('body--has-error')
  }
})

// eslint-disable-next-line import/prefer-default-export
export const eventEmitter = emitter
