#= require models/data/query
#= require models/data/project
#= require models/data/user

data = @edsc.models.data
ns = @edsc.models.page

ns.AccessPage = do (ko,
                    setCurrent = ns.setCurrent
                    accessData = @edscPageData
                    QueryModel = data.Query
                    ProjectModel = data.Project
                    UserModel = data.User

                    ) ->

  class AccessPage
    constructor: ->
      @query = new QueryModel()
      @project = new ProjectModel(@query)
      console.log accessData
      @project.fromJson(accessData)
      @bindingsLoaded = ko.observable(false)
      @user = new UserModel()

      @ui =
        isLandingPage: false


  setCurrent(new AccessPage())

  exports = AccessPage
