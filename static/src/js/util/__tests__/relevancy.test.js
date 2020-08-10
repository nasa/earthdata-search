import exactMatch from '../relevancy'

describe('exactMatch', () => {
  test('return false if no keyword is provided', () => {
    const metadata = {
      title: 'test'
    }

    expect(exactMatch(metadata, undefined)).toBeFalsy()
  })

  test('return false with no match', () => {
    const metadata = {
      title: 'test'
    }

    const keyword = 'no match'

    expect(exactMatch(metadata, keyword)).toBeFalsy()
  })

  test('matches title', () => {
    const metadata = {
      title: 'test'
    }

    const keyword = 'test'

    expect(exactMatch(metadata, keyword)).toBeTruthy()
  })

  test('matches collection id', () => {
    const metadata = {
      id: 'test'
    }

    const keyword = 'test'

    expect(exactMatch(metadata, keyword)).toBeTruthy()
  })

  test('matches short name', () => {
    const metadata = {
      short_name: 'test'
    }

    const keyword = 'test'

    expect(exactMatch(metadata, keyword)).toBeTruthy()
  })

  test('matches short name and version', () => {
    const metadata = {
      short_name: 'test',
      version_id: '123'
    }

    expect(exactMatch(metadata, 'test 123')).toBeTruthy()
    expect(exactMatch(metadata, 'test v123')).toBeTruthy()
    expect(exactMatch(metadata, 'test_123')).toBeTruthy()
    expect(exactMatch(metadata, 'test_v123')).toBeTruthy()
  })
})
