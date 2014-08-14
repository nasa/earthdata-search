describe 'user', ->
  ns = window.edsc.models.data

  beforeEach ->
    @user = new ns.User()
    @user.name('edsc')

    jasmine.Ajax.install()

  afterEach ->
    jasmine.Ajax.uninstall()

  describe 'Valid Token', ->
    beforeEach ->
      @user.expires(9999999999)
      @user.checkToken((->))

    it 'does not request a token refresh', ->
      expect(jasmine.Ajax.requests.mostRecent()).toBeUndefined()

  describe 'Expired Tokens', ->
    beforeEach ->
      @user.expires(1)
      @user.checkToken((->))

    it 'requests a token refresh', ->
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('refresh_token')
