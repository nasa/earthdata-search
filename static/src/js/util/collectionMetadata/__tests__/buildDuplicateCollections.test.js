import { buildDuplicateCollections } from '../buildDuplicateCollections'

describe('buildDuplicateCollections', () => {
  test('returns an array of ids for duplicate collections', () => {
    const json = {
      duplicateCollections: {
        count: 1,
        items: [
          { id: 'C2208418228-POCLOUD' }
        ]
      }
    }

    expect(buildDuplicateCollections(json)).toEqual(['C2208418228-POCLOUD'])
  })

  test('returns an empty array if there are no duplicate collections', () => {
    const json = {
      duplicateCollections: {
        count: 0,
        items: []
      }
    }

    expect(buildDuplicateCollections(json)).toEqual([])
  })
})
