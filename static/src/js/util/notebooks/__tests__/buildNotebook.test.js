import MockDate from 'mockdate'

import { buildNotebook } from '../buildNotebook'

// Getting jest to play nice with the ipynb import is tricky, but we don't need
// the real template here. We just want to prove our values are being given to
// Handlebars to replace values in a JSON file. So mock the import of the ipynb
// file with this dummy JSON that has all the fields we want to replace
jest.mock('../notebookTemplate.ipynb?raw', () => JSON.stringify({
  baseUrl: '{{baseUrl}}',
  boundingBox: '{{boundingBox}}',
  collectionId: '{{collectionId}}',
  collectionTitle: '{{collectionTitle}}',
  generatedTime: '{{generatedTime}}',
  granuleId: '{{granuleId}}',
  granuleTitle: '{{granuleTitle}}',
  referrerUrl: '{{referrerUrl}}',
  variable: '{{variable}}'
}), { virtual: true })

beforeEach(() => {
  // Mock the date so the timestamp log is predictable
  MockDate.set('2025-01-01T00:00:00Z')
})

afterEach(() => {
  MockDate.reset()
})

describe('buildNotebook', () => {
  test('downloads a file with the given content and filename', () => {
    const boundingBox = '-10.18349,83.12257,-6.04617,86.57481'
    const granuleId = 'G3879539904-POCLOUD'
    const granules = {
      items: [
        {
          conceptId: 'G3877588998-POCLOUD',
          title: '20251123090000-JPL-L4_GHRSST-SSTfnd-MUR-GLOB-v02.0-fv04.1',
          collection: {
            conceptId: 'C1996881146-POCLOUD',
            shortName: 'MUR-JPL-L4-GLOB-v4.1',
            title: 'GHRSST Level 4 MUR Global Foundation Sea Surface Temperature Analysis (v4.1)',
            variables: {
              items: [
                {
                  name: 'analysed_sst'
                }
              ]
            }
          }
        }
      ]
    }
    const referrerUrl = 'http://localhost:8080/search/granules?p=C1996881146-POCLOUD&pg[0][v]=f&pg[0][gsk]=-start_date&q=C1996881146-POCLOUD&lat=40.17027231219319&long=146.25&zoom=1'

    const { fileName, notebook } = buildNotebook({
      boundingBox,
      granuleId,
      granules,
      referrerUrl
    })

    expect(fileName).toEqual('20251123090000-JPL-L4_GHRSST-SSTfnd-MUR-GLOB-v02.0-fv04.1_MUR-JPL-L4-GLOB-v4.1_sample-notebook.ipynb')

    expect(notebook).toEqual({
      baseUrl: 'http://localhost:8080',
      boundingBox: '[object Object]',
      collectionId: 'C1996881146-POCLOUD',
      collectionTitle: 'GHRSST Level 4 MUR Global Foundation Sea Surface Temperature Analysis (v4.1)',
      generatedTime: 'January 01, 2025 at 00:00:00 UTC',
      granuleId: 'G3879539904-POCLOUD',
      granuleTitle: '20251123090000-JPL-L4_GHRSST-SSTfnd-MUR-GLOB-v02.0-fv04.1',
      referrerUrl: 'http://localhost:8080/search/granules?p&#x3D;C1996881146-POCLOUD&amp;pg[0][v]&#x3D;f&amp;pg[0][gsk]&#x3D;-start_date&amp;q&#x3D;C1996881146-POCLOUD&amp;lat&#x3D;40.17027231219319&amp;long&#x3D;146.25&amp;zoom&#x3D;1',
      variable: 'analysed_sst'
    })
  })
})
