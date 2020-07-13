import { portalPath, portalPathFromState } from '../portalPath'

describe('portalPath', () => {
  test('returns no portal prefix when no portalId is present', () => {
    expect(portalPath()).toEqual('')
  })

  test('returns no portal prefix when the portalId is the default', () => {
    expect(portalPath({ portalId: 'edsc' })).toEqual('')
  })

  test('returns portal prefix with the portalId', () => {
    expect(portalPath({ portalId: 'simple' })).toEqual('/portal/simple')
  })
})

describe('portalPathFromState', () => {
  test('returns no portal prefix when the portalId is the default', () => {
    expect(portalPathFromState({
      portal: {
        portalId: 'edsc'
      }
    })).toEqual('')
  })

  test('returns portal prefix with the portalId', () => {
    expect(portalPathFromState({
      portal: {
        portalId: 'simple'
      }
    })).toEqual('/portal/simple')
  })
})
