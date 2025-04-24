import { generateFormDigest } from '../generateFormDigest'

describe('generateFormDigest', () => {
  test('converts a form element into a base64 encoded string representation', () => {
    const form = 'mock echo form data'

    expect(generateFormDigest(form)).toEqual('bW9jayBlY2hvIGZvcm0gZGF0YQ==')
  })
})
