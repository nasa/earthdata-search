import { eventEmitter } from '../events'
import '@testing-library/jest-dom'

describe('events', () => {
  describe('when an error is triggered without the error flag', () => {
    test('adds the class to the body', () => {
      eventEmitter.emit('error.global')
      expect(document.body).toHaveClass('body--has-error')
    })
  })

  describe('when an error is triggered with the error flag', () => {
    describe('when an error is set tp true', () => {
      test('adds the class to the body', () => {
        eventEmitter.emit('error.global', true)
        expect(document.body).toHaveClass('body--has-error')
      })
    })

    describe('when an error is set tp false', () => {
      test('removes the class to the body', () => {
        document.body.classList.add('body--has-error')
        eventEmitter.emit('error.global', false)
        expect(document.body).not.toHaveClass('body--has-error')
      })
    })
  })
})
