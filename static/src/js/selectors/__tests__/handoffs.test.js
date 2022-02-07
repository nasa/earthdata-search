import {
  getHandoffs,
  getSotoLayers
} from '../handoffs'

describe('getHandoffs selector', () => {
  test('returns the handoffs data', () => {
    const state = {
      handoffs: {
        sotoLayers: ['layer1']
      }
    }

    expect(getHandoffs(state)).toEqual({
      sotoLayers: ['layer1']
    })
  })

  test('returns an empty object when there is no handoffs', () => {
    const state = {}

    expect(getHandoffs(state)).toEqual({})
  })
})

describe('getSotoLayers', () => {
  test('returns the sotoLayers', () => {
    const state = {
      handoffs: {
        sotoLayers: ['layer1']
      }
    }

    expect(getSotoLayers(state)).toEqual(['layer1'])
  })
})
