// Sharp isn't written in JSDOM so we cannot use any automatic mocking from jest
const result = {
  resize: jest.fn().mockReturnThis(),
  toFormat: jest.fn().mockReturnThis(),
  toBuffer: jest.fn().mockReturnThis(),
  metadata: jest.fn()
}

module.exports = jest.fn(() => result)
