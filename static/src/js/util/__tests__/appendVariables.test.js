import { appendVariables } from '../appendVariables'

describe('appendVariables', () => {
  it('should append variables to baseVariables with type as the key', () => {
    const baseVariables = {
      count: 2,
      items: [
        {
          conceptId: 'V1200277776-E2E_18_4',
          name: 'ClusterDistortion'
        },
        {
          conceptId: 'V1200277788-E2E_18_4',
          name: 'ClusterMeanSquaredError'
        }
      ]
    }

    const targetVariables = {
      count: 1,
      items: [
        {
          conceptId: 'S1200277768-E2E_18_4',
          type: 'OPeNDAP',
          variables: {
            items: [
              {
                conceptId: 'V1200279034-E2E_18_4',
                name: 'Dust_Score_A'
              },
              {
                conceptId: 'V1200279045-E2E_18_4',
                name: 'Dust_Score_A_ct'
              }
            ]
          }
        }
      ]
    }

    const result = appendVariables(baseVariables, targetVariables)

    expect(result).toEqual({
      count: 2,
      items: [
        {
          conceptId: 'V1200277776-E2E_18_4',
          name: 'ClusterDistortion'
        },
        {
          conceptId: 'V1200277788-E2E_18_4',
          name: 'ClusterMeanSquaredError'
        }
      ],
      opendap: {
        count: 2,
        items: [
          {
            conceptId: 'V1200279034-E2E_18_4',
            name: 'Dust_Score_A'
          },
          {
            conceptId: 'V1200279045-E2E_18_4',
            name: 'Dust_Score_A_ct'
          }
        ]
      }
    })
  })
})
