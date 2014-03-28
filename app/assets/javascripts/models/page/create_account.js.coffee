#= require models/data/account

data = @edsc.models.data
ns = @edsc.models.page

ns.CreateAccountPage = do (ko
                          setCurrent = ns.setCurrent
                          AccountModel = data.Account
                          UserModel = data.User
                          ) ->

  class CreateAccountPage
    constructor: ->
      @account = new AccountModel()
      @bindingsLoaded = ko.observable(false)

      @ui =
        isLandingPage: false

  setCurrent(new CreateAccountPage())

  exports = CreateAccountPage