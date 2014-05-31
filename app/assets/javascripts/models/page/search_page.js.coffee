#= require util/url
#= require util/deparam
#= require models/data/grid
#= require models/data/query
#= require models/data/datasets
#= require models/data/dataset_facets
#= require models/data/project
#= require models/data/user
#= require models/data/preferences
#= require models/ui/spatial_type
#= require models/ui/temporal
#= require models/ui/datasets_list
#= require models/ui/project_list
#= require models/ui/granule_timeline

models = @edsc.models
data = models.data
ui = models.ui

ns = models.page

ns.SearchPage = do (ko
                    window
                    extend = $.extend
                    config = @edsc.config
                    urlUtil = @edsc.util.url
                    deparam = @edsc.util.deparam
                    setCurrent = ns.setCurrent
                    QueryModel = data.query.DatasetQuery
                    DatasetsModel = data.Datasets
                    DatasetFacetsModel = data.DatasetFacets
                    ProjectModel = data.Project
                    UserModel = data.User
                    SpatialTypeModel = ui.SpatialType
                    DatasetsListModel = ui.DatasetsList
                    ProjectListModel = ui.ProjectList
                    GranuleTimelineModel = ui.GranuleTimeline
                    PreferencesModel = data.Preferences) ->

  class SearchPage
    constructor: ->
      @query = new QueryModel()
      @user = new UserModel()
      @datasets = new DatasetsModel(@query)
      @datasetFacets = new DatasetFacetsModel(@query)
      @project = new ProjectModel(@query)
      @preferences = new PreferencesModel(@user)

      @ui =
        spatialType: new SpatialTypeModel(@query)
        datasetsList: new DatasetsListModel(@query, @datasets)
        projectList: new ProjectListModel(@project, @user, @datasets)
        isLandingPage: ko.observable(null) # Used by modules/landing

      @bindingsLoaded = ko.observable(false)

      @spatialError = ko.computed(@_computeSpatialError)
      @overlayState = ko.observable(null)

      first = true
      ko.computed =>
        state = @overlayState()?[1]
        isRelevant = @datasetFacets.isRelevant
        if first
          first = false
          return
        if !state || state == 't'
          isRelevant(true)
        else
          setTimeout((-> isRelevant(false)), config.defaultAnimationDurationMs)

    clearFilters: =>
      @query.clearFilters()
      @ui.spatialType.selectNone()

    pluralize: (value, singular, plural) ->
      word = if value == 1 then singular else plural
      "#{value} #{word}"

    _computeSpatialError: =>
      error = @datasets.error()
      if error?
        return "Polygon boundaries must not cross themselves" if error.indexOf('ORA-13349') != -1
        return "Polygon is too large" if error.indexOf('ORA-13367') != -1
        return error if error.indexOf('ORA-') != -1
      null

    serialize: ->
      result = {}
      result = extend(result, @project.serialized())
      result.o = @overlayState() if @overlayState()
      result

    load: (params) ->
      @project.serialized(params)
      @overlayState(params.o)

  current = new SearchPage()
  setCurrent(current)

  loadFromUrl = ->
    unless current.ui.isLandingPage() # Avoid problem where switching to /search overwrites uncommited search conditions
      current.load(deparam(window.location.search.substring(1)))

  loadFromUrl()

  $(window).on 'statechange anchorchange', loadFromUrl
  $(document).on 'ready', loadFromUrl

  historyChanged = false
  history = ko.computed
    read: ->
      historyChanged = true if urlUtil.saveState(@serialize(), !historyChanged)

    owner: current

  history.extend(throttle: config.xhrRateLimitMs)

  $(document).ready ->
    current.ui.granuleTimeline = new GranuleTimelineModel(current.ui.datasetsList, current.ui.projectList)

    $overlay = $('.master-overlay')
    $overlay.masterOverlay()
    $overlay.on 'edsc.olstatechange', -> current.overlayState($overlay.masterOverlay('state'))
    ko.computed -> $overlay.masterOverlay('state', current.overlayState())

  exports = SearchPage
