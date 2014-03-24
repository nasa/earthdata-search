#= require models/data/user

data = @edsc.models.data
ns = @edsc.models.page

ns.CreateAccountPage = do (ko
                          setCurrent = ns.setCurrent
                          UserModel = data.User
                          ) ->

  class CreateAccountPage
    constructor: ->
      @user = new UserModel()
      @bindingsLoaded = ko.observable(false)

      @ui =
        isLandingPage: false

  setCurrent(new CreateAccountPage())

  exports = CreateAccountPage