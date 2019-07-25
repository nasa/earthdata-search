import { echoFormXml } from './mocks'
import { getFieldElementValue } from '../getFieldElementValue'

describe('util#getFieldElementValue', () => {
  test('correctly discovers the correct fields from the provided xml', () => {
    expect(getFieldElementValue(echoFormXml, 'CLIENT')).toEqual('ESI')
    expect(getFieldElementValue(echoFormXml, 'FORMAT')).toEqual('VRT')
    expect(getFieldElementValue(echoFormXml, 'INCLUDE_META')).toEqual('false')
    expect(getFieldElementValue(echoFormXml, 'REQUEST_MODE')).toEqual('async')
    expect(getFieldElementValue(echoFormXml, 'SUBAGENT_ID')).toEqual('GDAL')
  })
})
