import { alphabet, createEmptyAlphabeticListObj } from '../alphabetic-list'

describe('alphabeticList', () => {
  describe('alphabet', () => {
    test('contains the correct characters', () => {
      expect(alphabet).toEqual(['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'])
    })
  })

  describe('createEmptyAlphabeticListObj', () => {
    test('creates the correct object', () => {
      const alphabeticList = createEmptyAlphabeticListObj()
      expect(alphabeticList).toEqual({
        '#': [],
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        G: [],
        H: [],
        I: [],
        J: [],
        K: [],
        L: [],
        M: [],
        N: [],
        O: [],
        P: [],
        Q: [],
        R: [],
        S: [],
        T: [],
        U: [],
        V: [],
        W: [],
        X: [],
        Y: [],
        Z: []
      })
    })
  })
})
