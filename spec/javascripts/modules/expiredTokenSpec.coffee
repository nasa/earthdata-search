describe 'xhr util', ->
  xhr = window.edsc.util.xhr

  describe 'Valid Token', ->
    beforeEach ->
      window.urs_user = {"username":"edsc","expires":9999999999};
      xhr.setTokenExpires()

    it 'does not request a token refresh', ->
      expect(xhr.isTokenExpired()).toBe(false)

  describe 'Expired Tokens', ->
    beforeEach ->
      window.urs_user = {"username":"edsc","expires":1};
      xhr.setTokenExpires()

    it 'requests a token refresh', ->
      expect(xhr.isTokenExpired()).toBe(true)
