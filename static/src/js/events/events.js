import EventEmitter from 'events'

const emitter = new EventEmitter()

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
