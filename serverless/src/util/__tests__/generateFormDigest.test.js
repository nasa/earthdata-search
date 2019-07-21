import { generateFormDigest } from '../generateFormDigest'

describe('generateFormDigest', () => {
  test('retrieves the username from the endpoint field', () => {
    const form = 'mock echo form data'

    expect(generateFormDigest(form)).toEqual('e60e33c401915211e731cbcf993ecfe1102a4a22')
  })
})
