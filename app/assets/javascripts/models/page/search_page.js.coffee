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

models = @edsc.models
data = models.data
ui = models.ui

ns = models.page

ns.SearchPage = do (ko
                    ajax = @edsc.util.xhr.ajax
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
                    StateManager = ui.StateManager) ->
  current = null

  $(document).ready ->
    current.map = map = new window.edsc.map.Map(document.getElementById('map'), 'geo')
    current.ui.granuleTimeline = new GranuleTimelineModel(current.ui.collectionsList, current.ui.projectList)
    $('.master-overlay').masterOverlay()
    # $('.launch-variable-modal').click ->
    #   $('#variablesModal').modal('show')
    # $('.launch-customize-modal').click ->
    #   $('#customizeDataModal').modal('show')

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
        isLandingPage: ko.observable(null) # Used by modules/landing
        feedback: new FeedbackModel()

      @bindingsLoaded = ko.observable(false)
      @labs = ko.observable(false)

      @spatialError = ko.computed(@_computeSpatialError)

      @collections.isRelevant(false) # Avoid load until the URL says it's ok

      @workspaceName = ko.observable(null)
      @workspaceNameField = ko.observable(null)

      @project.focus.subscribe(@_updateFocusRenderState)

      @outputFileFormats = ko.observableArray([])
      @chosenOutputFileFormat = ko.observable(@query.outputFormat())

      @reprojectionOptions = ko.observableArray([])
      @chosenReprojectionOption = ko.observable(@query.reprojectionOption())

      @resampleDimensions = ko.observableArray([])
      @chosenResampleDimension = ko.observable(@query.resampleDimension())

      @interpolationMethods = ko.observableArray([])
      @chosenInterpolationMethod = ko.observable(@query.interpolationMethod())

      new StateManager(this).monitor()

    _updateFocusRenderState: (newFocus) =>
      if @_focus
        @_focus.notifyRenderers('endSearchFocus')
      @_focus = newFocus
      if @_focus
        @_focus.notifyRenderers('startSearchFocus')

    clearFilters: =>
      @query.clearFilters()
      @ui.spatialType.selectNone()
      @ui.spatialType.clearManualEntry()
      @spatialEntry.clearError()
#      @chosenOutputFileFormat('')
#      @chosenReprojectionOption('')
#      @chosenResampleDimension('')
#      @chosenInterpolationMethod('')
#      for m in document.querySelectorAll('[id^=measurement-]')
#        ko.removeNode(m)

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

    getMeasurements: =>
      if @query.measurement()
        # show variables
        @getVariables(null, {target: {text: @query.measurement()}})
      else
        ajax
          dataType: 'json'
          url: '/measurements'
          success: (data) =>
            console.log data
            $("#variablesModal .modal-body ul").remove()
            $('#variablesModal .modal-body').append('<ul></ul>')
            for m in data.measurements
              id = 'measurement-' + m.toLowerCase().replace(/\s/g, '_')
              $('#variablesModal .modal-body ul').append('<li><a id="' + id + '" href="#">' + m + '</a></li>')
              # bind click
              $("##{id}").on 'click', (e) => @getVariables(null, e)
          complete: =>
            $('#variablesModal').modal('show')

    getVariables: (data, event)=>
      $('[id^=measurement-]').closest('ul').remove()
      @query.measurement(event.target.text)

      ajax
        dataType: 'json'
        url: '/variables'
        data: {measurement: event.target.text}
        success: (data) =>
          console.log data
          $("#variablesModal .modal-body ul").remove()
          $("#variablesModal .modal-body").append("<ul></ul>")
          for v in data.variables
            id = 'variable-' + v.toLowerCase().replace(/\s/g, '_')
            $('#variablesModal .modal-body ul').append('<li><a id="' + id + '" href="#">' + v + '</a></li>')
            $("##{id}").on 'click', (e) =>
              @query.variable(e.target.text)
        complete: =>
          $('#variablesModal').modal('show') unless $('#variablesModal').is(':visible')

    getCustomizeOptions: =>
      ajax
        dataType: 'json'
        url: "/customize_options"
        success: (data) =>
          @outputFileFormats(data.output_file_formats)
          @reprojectionOptions(data.reprojection_options)
          @resampleDimensions(data.resample_dimensions)
          @interpolationMethods(data.interpolation_methods)
        complete: =>
          $('#customizeDataModal').modal('show')
          @chosenOutputFileFormat(@query.outputFormat())
          @chosenReprojectionOption(@query.reprojectionOption())
          @chosenResampleDimension(@query.resampleDimension())
          @chosenInterpolationMethod(@query.interpolationMethod())

    updateCustomizeOptionsQuery: =>
      @query.outputFormat(@chosenOutputFileFormat())
      @query.reprojectionOption(@chosenReprojectionOption())
      @query.resampleDimension(@chosenResampleDimension())
      @query.interpolationMethod(@chosenInterpolationMethod())

  current = new SearchPage()
  setCurrent(current)

  exports = SearchPage
