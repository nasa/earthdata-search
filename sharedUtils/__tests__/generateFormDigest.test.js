import { generateFormDigest } from '../generateFormDigest'

describe('generateFormDigest', () => {
  test('retrieves the username from the endpoint field', () => {
    const form = 'mock echo form data'

    expect(generateFormDigest(form)).toEqual('bW9jayBlY2hvIGZvcm0gZGF0YQ==')
  })
})
