#= require models/data/query
#= require models/data/project
#= require models/data/user
#= require models/ui/temporal
#= require models/ui/project_list

data = @edsc.models.data
ui = @edsc.models.ui
ns = @edsc.models.page
ui = @edsc.models.ui

ns.AccessPage = do (ko,
                    setCurrent = ns.setCurrent
                    accessData = @edscPageData
                    QueryModel = data.Query
                    ProjectModel = data.Project
                    UserModel = data.User
                    TemporalModel = ui.Temporal
                    ProjectListModel = ui.ProjectList
                    ) ->

  class AccessPage
    constructor: ->
      @query = new QueryModel()
      @project = new ProjectModel(@query)
      @project.fromJson(accessData)
      @bindingsLoaded = ko.observable(false)
      @user = new UserModel()

      @ui =
        isLandingPage: false
        temporal: new TemporalModel(@query)
        projectList: new ProjectListModel(@project, @user)

  setCurrent(new AccessPage())

  exports = AccessPage
