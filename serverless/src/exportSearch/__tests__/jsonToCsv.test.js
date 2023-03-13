import { jsonToCsv } from '../jsonToCsv'

describe('jsonToCsv', () => {
  test('converts a JSON array to CSV', () => {
    const json = [{
      provider: 'test provider',
      shortName: 'test shortName',
      version: 'test versionId',
      title: 'test title',
      processingLevel: {
        id: 'test processingLevelId'
      },
      platforms: [{ shortName: 'test platforms' }],
      timeStart: 'test timeStart',
      timeEnd: 'test timeEnd'
    }]

    const csv = 'Data Provider,Short Name,Version,Entry Title,Processing Level,Platform,Start Time,End Time\r\n"test provider","test shortName","test versionId","test title","test processingLevelId","test platforms","test timeStart","test timeEnd"\r\n'

    expect(jsonToCsv(json)).toEqual(csv)
  })

  test('converts an array of platforms to a string', () => {
    const json = [{
      provider: 'test provider',
      shortName: 'test shortName',
      version: 'test versionId',
      title: 'test title',
      processingLevel: {
        id: 'test processingLevelId'
      },
      platforms: [{
        shortName: 'test platform 1'
      }, {
        shortName: 'test platform 2'
      }],
      timeStart: 'test timeStart',
      timeEnd: null
    }]

    const csv = 'Data Provider,Short Name,Version,Entry Title,Processing Level,Platform,Start Time,End Time\r\n"test provider","test shortName","test versionId","test title","test processingLevelId","test platform 1, test platform 2","test timeStart",\r\n'

    expect(jsonToCsv(json)).toEqual(csv)
  })

  test('replaces null values with empty strings', () => {
    const json = [{
      provider: 'test provider',
      shortName: 'test shortName',
      version: 'test versionId',
      title: 'test title',
      processingLevel: {
        id: 'test processingLevelId'
      },
      platforms: [{ shortName: 'test platforms' }],
      timeStart: 'test timeStart',
      timeEnd: null
    }]

    const csv = 'Data Provider,Short Name,Version,Entry Title,Processing Level,Platform,Start Time,End Time\r\n"test provider","test shortName","test versionId","test title","test processingLevelId","test platforms","test timeStart",\r\n'

    expect(jsonToCsv(json)).toEqual(csv)
  })
})
