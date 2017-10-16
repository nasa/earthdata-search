#= require models/data/query
#= require models/data/project
#= require models/data/preferences
#= require models/ui/temporal
#= require models/ui/project_list
#= require models/ui/service_options_list
#= require models/ui/feedback
#= require models/ui/sitetour

data = @edsc.models.data
ui = @edsc.models.ui
ns = @edsc.models.page

ns.ProjectPage = do (ko,
  setCurrent = ns.setCurrent
  urlUtil = @edsc.util.url
  QueryModel = data.query.CollectionQuery
  ProjectModel = data.Project
  PreferencesModel = data.Preferences
  TemporalModel = ui.Temporal
  ProjectListModel = ui.ProjectList
  SiteTourModel = ui.SiteTour
  ServiceOptionsListModel = ui.ServiceOptionsList
  FeedbackModel = ui.Feedback
) ->

  class ProjectPage
    constructor: ->
      @query = new QueryModel()
      @project = new ProjectModel(@query)
      @projectQuery =
      @id = window.location.href.match(/\/projects\/(\d+)$/)?[1]
      @bindingsLoaded = ko.observable(false)
      @preferences = new PreferencesModel()
      @workspaceName = ko.observable(null)
      @workspaceNameField = ko.observable(null)
      @projectGranules = ko.computed(@_computeProjectGranules, this, deferEvaluation: true)

      projectList = new ProjectListModel(@project)
      @ui =
        temporal: new TemporalModel(@query)
        projectList: projectList
        feedback: new FeedbackModel()
        sitetour: new SiteTourModel()

      $(window).on 'edsc.save_workspace', (e)=>
        urlUtil.saveState('/search/collections', urlUtil.currentParams(), true, @workspaceNameField())
        @workspaceName(@workspaceNameField())
        $('.save-dropdown').removeClass('open')

      setTimeout((=>
        @_loadFromUrl()
        $(window).on 'edsc.pagechange', @_loadFromUrl), 0)

    _loadFromUrl: (e)=>
      @project.serialized(urlUtil.currentParams())
      @workspaceName(urlUtil.getProjectName())

    _computeProjectGranules: =>
      if @project.collections()?.length > 0
        if @project?.collections?().length > 0
          total = @project.collections().reduce (x,y) -> x.granuleCount?() ? 0 + y.granuleCount()
        excluded = 0
        for pg in @project.serialized().pg when pg.exclude? && @project.serialized().pg?
          excluded += pg.exclude.echo_granule_id.length
        total - excluded

  setCurrent(new ProjectPage())

  exports = ProjectPage
