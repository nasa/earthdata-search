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
                    urlUtil = @edsc.util.url
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
      @project.serialized(urlUtil.currentParams())
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
      @reprojectionConfigs = ko.observableArray([])
      @chosenReprojectionOption = ko.observable(@query.reprojectionOption())

      @resampleDimensions = ko.observableArray([])
      @chosenResampleDimension = ko.observable(@query.resampleDimension())

      @interpolationMethods = ko.observableArray([])
      @chosenInterpolationMethod = ko.observable(@query.interpolationMethod())

      @measurements = ko.observable({})
      @chosenMeasurement = ko.observable()
      @checkedVariables = ko.observableArray([])

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
      @chosenMeasurement(null)
      @checkedVariables([])
      @measurements({})

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
      @measurements(@query.measurements())
      @checkedVariables([])
#      if @chosenMeasurement()
#        @getVariables(null, {target: {text: @chosenMeasurement()}})
#      else
      ajax
        dataType: 'json'
        url: '/measurements'
        success: (data) =>
          $('#check-all-vars-container').remove()
          $("#variables-modal .modal-body ul").remove()
          $('#back-to-measurements').remove()

          $('#variables-modal .modal-body').append('<ul></ul>')
          for m in data.measurements
            id = 'measurement-' + m.toLowerCase().replace(/\s/g, '_')
            $('#variables-modal .modal-body ul').append('<li><a id="' + id + '" href="#">' + m + '</a></li>')
            # bind click
            $("##{id}").on 'click', (e) => @getVariables(null, e)
        complete: =>
          $('#variables-modal').modal('show')

    getVariables: (data, event)=>
      $('[id^=measurement-]').closest('ul').remove()
      @chosenMeasurement(event.target.text)
      measurement = @measurements()[@chosenMeasurement()]
      unless measurement
        @measurements()[@chosenMeasurement()] = []

      ajax
        dataType: 'json'
        url: '/variables'
        data: {measurement: event.target.text}
        success: (data) =>
          console.log data
          $("#variables-modal .modal-body ul").remove()
          $('#check-all-vars-container').remove()
          $('#back-to-measurements').remove()

          # add check all
          $("#variables-modal .modal-body").append('<div id="check-all-vars-container"><input id="check-all-vars" type="checkbox"><label for="check-all-vars">Select All Variables</label></div>')

          # hook up check all
          $('#check-all-vars').on 'change', (e) =>
            if $(e.target).is(':checked')
              $('.modal-body ul input:checkbox').prop('checked', true)
            else
              $('.modal-body ul input:checkbox').prop('checked', false)

          # add variable checkboxes
          $("#variables-modal .modal-body").append("<ul></ul>")
          for v in data.variables
            # find in query param
            found = false
            found = (i for i in @query.measurements()[@chosenMeasurement()] when i == v)[0] if @query.measurements()[@chosenMeasurement()]
            id = 'variable-' + v.toLowerCase().replace(/\s/g, '_')
            $('#variables-modal .modal-body ul').append('<li><input id="' + id + '" type="checkbox" ' + (if found then 'checked="checked"' else '') + '><label for="' + id + '">' + v + '</label></li>')
          $('#check-all-vars').prop('checked', $('.modal-body ul input:checkbox').length == $('.modal-body ul input[type=checkbox]:checked').length)

          # hook up variable checkboxes
          $('.modal-body ul input[type=checkbox]').on 'change', (e) =>
            $('#check-all-vars').prop('checked', $('.modal-body ul input:checkbox').length == $('.modal-body ul input[type=checkbox]:checked').length)

          # add back to measurement
          $('#variables-modal .modal-body').append('<a href="#" id="back-to-measurements">Back to Measurement List</a>')

          # hook up back to measurement
          $('#back-to-measurements').on 'click', (e) =>
            @chosenMeasurement(null)
            @getMeasurements()
        complete: =>
          $('#variables-modal').modal('show') unless $('#variables-modal').is(':visible')

    applyVariables: =>
      $.each($('#variables-modal li input:checked'), (i, val)=> @checkedVariables.push $('label[for=' + $(val).prop('id') + ']').text())
      @measurements()[@chosenMeasurement()].push(@checkedVariables())
      @measurements()[@chosenMeasurement()] = [].concat.apply([], @measurements()[@chosenMeasurement()]).unique()
      @query.measurements(@measurements())

    getCustomizeOptions: =>
      ajax
        dataType: 'json'
        url: "/customize_options"
        success: (data) =>
          @outputFileFormats(data.output_file_formats)
          @reprojectionOptions([])
          @reprojectionConfigs([])
          for reprojection in data.reprojection_options
            @reprojectionOptions.push(reprojection.name)
            @reprojectionConfigs.push(reprojection)
          @resampleDimensions(data.resample_dimensions)
          @interpolationMethods(data.interpolation_methods)

          @chosenOutputFileFormat(@query.outputFormat())
          @chosenReprojectionOption(@query.reprojectionOption())
          $('#reprojection-params').empty()
          reprojectionConfig = (reprojection.params for reprojection in @reprojectionConfigs() when reprojection.name == @chosenReprojectionOption())[0]
          if reprojectionConfig
            for config in reprojectionConfig
              id = 'projection_param-' + config.name.toLowerCase().replace(/\s/g, '_')
              $('#reprojection-params').append("<div><label for='" + id + "'>" + config.name + "</label><input id='" + id + "' type='text'></input></div>")
          @chosenResampleDimension(@query.resampleDimension())
          if @chosenResampleDimension()
            $('#resample-params').append("<div><label for='resample-value'>Value</label><input id='resample-value' type='text'></input></div>")
          else
            $('#resample-params').empty()
          @chosenInterpolationMethod(@query.interpolationMethod())
        complete: =>
          $('#customizeDataModal').modal('show')

    updateCustomizeOptionsQuery: =>
      @query.outputFormat(@chosenOutputFileFormat())
      @query.reprojectionOption(@chosenReprojectionOption())
      $('#reprojection-params').empty()
      reprojectionConfig = (reprojection.params for reprojection in @reprojectionConfigs() when reprojection.name == @chosenReprojectionOption())[0]
      if reprojectionConfig
        for config in reprojectionConfig
          id = 'projection_param-' + config.name.toLowerCase().replace(/\s/g, '_')
          $('#reprojection-params').append("<div><label for='" + id + "'>" + config.name + "</label><input id='" + id + "' type='text'></input></div>")
      @chosenResampleDimension(null) unless @chosenReprojectionOption()
      @query.resampleDimension(@chosenResampleDimension())
      if @chosenResampleDimension()
        $('#resample-params').append("<div><label for='resample-value'>Value</label><input id='resample-value' type='text'></input></div>")
      else
        $('#resample-params').empty()
      @query.interpolationMethod(@chosenInterpolationMethod())

  current = new SearchPage()
  setCurrent(current)

  exports = SearchPage
