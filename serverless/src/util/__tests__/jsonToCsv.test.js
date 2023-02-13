import { jsonToCsv } from '../jsonToCsv'

describe('jsonToCsv', () => {
  const columns = [
    { name: 'Data Provider', path: 'provider' },
    { name: 'Short Name', path: 'shortName' },
    { name: 'Version', path: 'versionId' },
    { name: 'Entry Title', path: 'title' },
    { name: 'Processing Level', path: 'processingLevelId' },
    { name: 'Platform', path: 'platforms.shortName' },
    { name: 'Start Time', path: 'timeStart' },
    { name: 'End Time', path: 'timeEnd' }
  ]

  test('converts a JSON array to CSV', () => {
    const json = [{
      provider: 'test provider',
      shortName: 'test shortName',
      versionId: 'test versionId',
      title: 'test title',
      processingLevelId: 'test processingLevelId',
      platforms: [{ shortName: 'test platforms' }],
      timeStart: 'test timeStart',
      timeEnd: 'test timeEnd'
    }]

    const csv = 'Data Provider,Short Name,Version,Entry Title,Processing Level,Platform,Start Time,End Time\r\ntest provider,test shortName,test versionId,test title,test processingLevelId,test platforms,test timeStart,test timeEnd\r\n'

    expect(jsonToCsv(json, columns)).toEqual(csv)
  })

  test('converts an array of platforms to a string', () => {
    const json = [{
      provider: 'test provider',
      shortName: 'test shortName',
      versionId: 'test versionId',
      title: 'test title',
      processingLevelId: 'test processingLevelId',
      platforms: [{
        shortName: 'test platform 1'
      }, {
        shortName: 'test platform 2'
      }],
      timeStart: 'test timeStart',
      timeEnd: null
    }]

    const csv = 'Data Provider,Short Name,Version,Entry Title,Processing Level,Platform,Start Time,End Time\r\ntest provider,test shortName,test versionId,test title,test processingLevelId,"test platform 1, test platform 2",test timeStart,\r\n'

    expect(jsonToCsv(json, columns)).toEqual(csv)
  })

  test('replaces null values with empty strings', () => {
    const json = [{
      provider: 'test provider',
      shortName: 'test shortName',
      versionId: 'test versionId',
      title: 'test title',
      processingLevelId: 'test processingLevelId',
      platforms: [{ shortName: 'test platforms' }],
      timeStart: 'test timeStart',
      timeEnd: null
    }]

    const csv = 'Data Provider,Short Name,Version,Entry Title,Processing Level,Platform,Start Time,End Time\r\ntest provider,test shortName,test versionId,test title,test processingLevelId,test platforms,test timeStart,\r\n'

    expect(jsonToCsv(json, columns)).toEqual(csv)
  })
})
