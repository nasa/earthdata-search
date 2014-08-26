describe 'xhr util', ->
  xhr = window.edsc.util.xhr

  describe 'Valid Token', ->
    beforeEach ->
      window.urs_user = {"expires_in":9999999999}

    afterEach ->
      window.urs_user = null
      xhr.getTokenExpires()

    it 'does not request a token refresh', ->
      expect(xhr.isTokenExpired()).toBe(false)

  describe 'Expired Tokens', ->
    beforeEach ->
      window.urs_user = {"expires_in":1}

    afterEach ->
      window.urs_user = null
      xhr.getTokenExpires()

    it 'requests a token refresh', ->
      expect(xhr.isTokenExpired()).toBe(true)
