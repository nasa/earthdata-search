#= require models/data/grid
#= require models/data/query
#= require models/data/collections
#= require models/data/project
#= require models/data/preferences
#= require models/data/spatial_entry
#= require models/ui/spatial_type
#= require models/ui/temporal
#= require models/ui/collections_list
#= require models/ui/project_list
#= require models/ui/granule_timeline
#= require models/ui/state_manager
#= require models/ui/feedback
#= require models/ui/sitetour
#= require models/ui/reverb_retirement
#= require util/js.cookies

models = @edsc.models
data = models.data
ui = models.ui
ns = models.page

ns.SearchPage = do (ko
                    setCurrent = ns.setCurrent
                    QueryModel = data.query.CollectionQuery
                    CollectionsModel = data.Collections
                    ProjectModel = data.Project
                    SpatialEntry = data.SpatialEntry
                    SpatialTypeModel = ui.SpatialType
                    CollectionsListModel = ui.CollectionsList
                    ProjectListModel = ui.ProjectList
                    GranuleTimelineModel = ui.GranuleTimeline
                    PreferencesModel = data.Preferences
                    FeedbackModel = ui.Feedback
                    SiteTourModel = ui.SiteTour
                    ReverbRetirementModel = ui.ReverbRetirement
                    url = @edsc.util.url
                    StateManager = ui.StateManager) ->
  current = null

  preferences = new PreferencesModel()
  sitetour = new SiteTourModel()
  reverbRetirement = new ReverbRetirementModel()

  initModal = () ->
    $('#sitetourModal').modal('show') if sitetour.safePath() && (preferences.doNotShowTourAgain() == 'false' || window.location.href.indexOf('?tour=true') != -1)

  $(document).ready ->
    current.map = map = new window.edsc.map.Map(document.getElementById('map'), 'geo')
    current.ui.granuleTimeline = new GranuleTimelineModel(current.ui.collectionsList, current.ui.projectList)
    $('.master-overlay').masterOverlay()
    $('.launch-variable-modal').click ->
      $('#variablesModal').modal('show')
    $('.launch-customize-modal').click ->
      $('#customizeDataModal').modal('show')

    reverb = ["http://echo-reverb-rails.dev", "https://testbed.echo.nasa.gov", "https://api-test.echo.nasa.gov", "https://testbed.echo.nasa.gov", "https://reverb.echo.nasa.gov"]
    if $.inArray(document.referrer, reverb) != -1 && Cookies.get('ReadyForReverbRetirement') != 'true'
      $('#reverbRetirementModal').modal('show')
    else
      preferences.ready.done(-> initModal()) if !window.edscportal

  class SearchPage
    constructor: ->
      @query = new QueryModel()
      @collections = new CollectionsModel(@query)
      @project = new ProjectModel(@query)
      @preferences = new PreferencesModel()
      @spatialEntry = new SpatialEntry(@query.spatial)

      @ui =
        spatialType: new SpatialTypeModel(@query)
        collectionsList: new CollectionsListModel(@query, @collections, @project)
        projectList: new ProjectListModel(@project, @collections)
        feedback: new FeedbackModel()
        sitetour: new SiteTourModel()
        reverbRetirement: new ReverbRetirementModel()

      @bindingsLoaded = ko.observable(false)
      @labs = ko.observable(false)

      @spatialError = ko.computed(@_computeSpatialError)

      @collections.isRelevant(false) # Avoid load until the URL says it's ok

      @workspaceName = ko.observable(null)
      @workspaceNameField = ko.observable(null)

      @project.focus.subscribe(@_updateFocusRenderState)

      new StateManager(this).monitor()

    _updateFocusRenderState: (newFocus) =>
      if @_focus
        @_focus.notifyRenderers('endSearchFocus')
      @_focus = newFocus
      if @_focus
        @_focus.notifyRenderers('startSearchFocus')

    clearFilters: =>
      # EDSC-1448: The temporal dropdown is 'special' and needs to be programmatically closed...
      $('#temporal-dropdown.open').removeClass('open');
      @query.clearFilters()
      @ui.spatialType.selectNone()
      @ui.spatialType.clearManualEntry()
      @spatialEntry.clearError()
      @toggleFilterStack()
      if @project.focusedProjectCollection()
        @project.focusedProjectCollection().collection.granuleDatasource().clearFilters()

    clearSpatial: =>
      @ui.spatialType.clearManualEntry()
      @spatialEntry.clearError()
      @query.spatial(null)

    pluralize: (value, singular, plural) ->
      word = if value == 1 then singular else plural
      "#{value} #{word}"

    _computeSpatialError: =>
      error = @collections.error()
      if error?
        for e in error
          return e if e? && (e.indexOf('polygon') != -1 ||
                              e.indexOf('box') != -1 ||
                              e.indexOf('point') != -1)
      null

    hideParent: =>
      $('.master-overlay').masterOverlay('manualHideParent')

    showParent: =>
      $('.master-overlay').masterOverlay('manualShowParent')

    toggleFilterStack: (data, event) =>
      $('.filter-stack').toggle()

    totalFilters: =>
      length = (if @query.spatial() && @query.spatial().length then 1 else 0)
      length += (if @query.temporalComponent() then 1 else 0)
      length += (if @ui.spatialType.isGrid() || @query.grid.selected() then 1 else 0)
      length

    showProject: (data, event) =>
      $('#view-project').click()
  
  loc = window.location.pathname
  if loc.indexOf("portal") >= 0 && loc.slice(-6) != "search" && loc.slice(-1) != '/'
    window.location.replace(loc + '/search' + window.location.search);
  current = new SearchPage()
  setCurrent(current)

  exports = SearchPage
