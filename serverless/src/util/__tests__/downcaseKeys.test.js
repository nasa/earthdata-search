import { downcaseKeys } from '../downcaseKeys'

describe('downcaseKeys', () => {
  test('returns an empty object when undefined is provided', () => {
    const returnObject = downcaseKeys(undefined)

    expect(returnObject).toMatchObject({})
  })

  test('downcases keys', () => {
    const returnObject = downcaseKeys({
      KEY: 'value'
    })

    expect(returnObject).toMatchObject({
      key: 'value'
    })
  })

  test('downcases camel cased keys', () => {
    const returnObject = downcaseKeys({
      hyphenatedKey: 'value'
    })

    expect(returnObject).toMatchObject({
      hyphenatedkey: 'value'
    })
  })

  test('downcases hyphenated keys', () => {
    const returnObject = downcaseKeys({
      'Hyphenated-Key': 'value'
    })

    expect(returnObject).toMatchObject({
      'hyphenated-key': 'value'
    })
  })
})
