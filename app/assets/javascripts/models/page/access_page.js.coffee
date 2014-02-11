#= require models/data/query
#= require models/data/project
#= require models/data/user
#= require models/ui/temporal

data = @edsc.models.data
ns = @edsc.models.page
ui = @edsc.models.ui

ns.AccessPage = do (ko,
                    setCurrent = ns.setCurrent
                    accessData = @edscPageData
                    QueryModel = data.Query
                    ProjectModel = data.Project
                    UserModel = data.User
                    TemporalModel = ui.Temporal

                    ) ->

  class AccessPage
    constructor: ->
      @query = new QueryModel()
      @ui =
        isLandingPage: false
        temporal: new TemporalModel(@query)

      @project = new ProjectModel(@query)
      console.log accessData
      @project.fromJson(accessData)
      @bindingsLoaded = ko.observable(false)
      @user = new UserModel()



  setCurrent(new AccessPage())

  exports = AccessPage
