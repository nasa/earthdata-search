import { portalPath, portalPathFromState } from '../portalPath'

describe('portalPath', () => {
  test('returns no portal prefix when no portalId is present', () => {
    expect(portalPath()).toEqual('')
  })

  test('returns no portal prefix when the portalId is empty', () => {
    expect(portalPath({ portalId: '' })).toEqual('')
  })

  test('returns portal prefix with the portalId', () => {
    expect(portalPath({ portalId: 'simple' })).toEqual('/portal/simple')
  })
})

describe('portalPathFromState', () => {
  test('returns no portal prefix when the portalId is empty', () => {
    expect(portalPathFromState({
      portal: {
        portalId: ''
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
