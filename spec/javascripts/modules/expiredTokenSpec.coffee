describe 'xhr util', ->
  xhr = window.edsc.util.xhr

  describe 'Valid Token', ->
    beforeEach ->
      window.tokenExpiresIn = 9999999999
      window.tokenLoadTime = +new Date()

    afterEach ->
      window.tokenExpiresIn = null
      xhr.getTokenExpires()

    it 'does not request a token refresh', ->
      expect(xhr.isTokenExpired()).toBe(false)

  describe 'Expired Tokens', ->
    beforeEach ->
      window.tokenExpiresIn = -1
      window.tokenLoadTime = +new Date()

    afterEach ->
      window.tokenExpiresIn = null
      xhr.getTokenExpires()

    it 'requests a token refresh', ->
      expect(xhr.isTokenExpired()).toBe(true)
