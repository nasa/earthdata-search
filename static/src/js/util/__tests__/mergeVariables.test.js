import { mergeVariables } from '../mergeVariables'

describe('mergeVariables', () => {
  describe('when variables are present in the first object but not the second', () => {
    it('should merge two variable objects and ignore items with duplicate conceptIds', () => {
      const variables1 = {
        count: 2,
        items: [
          { conceptId: 'V1200277776-E2E_18_4', name: 'ClusterDistortion' },
          { conceptId: 'V1200100688-E2E_18_4', name: 'LatCenter' }
        ]
      }

      const variables2 = {
        count: 2,
        items: [
          { conceptId: 'V1200100688-E2E_18_4', name: 'LatCenter' },
          { conceptId: 'V1200277773-E2E_18_4', name: 'NormalizedValues' }
        ]
      }

      const result = mergeVariables(variables1, variables2)

      const expectedResult = {
        count: 3,
        items: [
          { conceptId: 'V1200277776-E2E_18_4', name: 'ClusterDistortion' },
          { conceptId: 'V1200100688-E2E_18_4', name: 'LatCenter' },
          { conceptId: 'V1200277773-E2E_18_4', name: 'NormalizedValues' }
        ]
      }

      expect(result).toEqual(expectedResult)
    })
  })
  describe('when variables are present in the second object but not the first', () => {
    it('should merge two variable objects and ignore items with duplicate conceptIds', () => {
      const variables1 = {
        count: 2,
        items: [
          { conceptId: 'V1200100688-E2E_18_4', name: 'LatCenter' },
          { conceptId: 'V1200277773-E2E_18_4', name: 'NormalizedValues' }
        ]
      }

      const variables2 = {
        count: 2,
        items: [
          { conceptId: 'V1200277776-E2E_18_4', name: 'ClusterDistortion' },
          { conceptId: 'V1200100688-E2E_18_4', name: 'LatCenter' }
        ]
      }

      const result = mergeVariables(variables1, variables2)

      const expectedResult = {
        count: 3,
        items: [
          { conceptId: 'V1200100688-E2E_18_4', name: 'LatCenter' },
          { conceptId: 'V1200277773-E2E_18_4', name: 'NormalizedValues' },
          { conceptId: 'V1200277776-E2E_18_4', name: 'ClusterDistortion' }
        ]
      }

      expect(result).toEqual(expectedResult)
    })
  })

  describe('when there are no variable items', () => {
    it('should handle cases with missing properties in the first object', () => {
      const variables1 = {
        count: 0,
        items: null

      }

      const variables2 = {
        count: 2,
        items: [
          { conceptId: 'V1200277776-E2E_18_4', name: 'ClusterDistortion' },
          { conceptId: 'V1200100688-E2E_18_4', name: 'LatCenter' }
        ]
      }

      const result = mergeVariables(variables1, variables2)

      const expectedResult = {
        count: 2,
        items: [
          { conceptId: 'V1200277776-E2E_18_4', name: 'ClusterDistortion' },
          { conceptId: 'V1200100688-E2E_18_4', name: 'LatCenter' }
        ]
      }

      expect(result).toEqual(expectedResult)
    })
    it('should handle cases with missing properties in the second object', () => {
      const variables1 = {
        count: 2,
        items: [
          { conceptId: 'V1200277776-E2E_18_4', name: 'ClusterDistortion' },
          { conceptId: 'V1200100688-E2E_18_4', name: 'LatCenter' }
        ]
      }

      const variables2 = {
        count: 0,
        items: null
      }

      const result = mergeVariables(variables1, variables2)

      const expectedResult = {
        count: 2,
        items: [
          { conceptId: 'V1200277776-E2E_18_4', name: 'ClusterDistortion' },
          { conceptId: 'V1200100688-E2E_18_4', name: 'LatCenter' }
        ]
      }

      expect(result).toEqual(expectedResult)
    })
    it('should handle cases with missing properties in both objects', () => {
      const variables1 = {
        count: 0,
        items: null
      }

      const variables2 = {
        count: 0,
        items: null
      }

      const result = mergeVariables(variables1, variables2)

      const expectedResult = {
        count: 0,
        items: null
      }

      expect(result).toEqual(expectedResult)
    })
  })
})
