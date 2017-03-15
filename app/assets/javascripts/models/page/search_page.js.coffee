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
  #   $('#variables-modal').modal('show')
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
      @checkedVariables(if @query.variables() == "" then [] else @query.variables())
      if @query.measurement() || @chosenMeasurement()
        @getVariables(null, {target: {text: if @chosenMeasurement() then @chosenMeasurement() else @query.measurement()}})
      else
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

    applyVariables: =>
      @query.measurement(@chosenMeasurement())
      $.each($('#variables-modal li input:checked'), (i, val)=> @checkedVariables.push $('label[for=' + $(val).prop('id') + ']').text())
      @query.variables(@checkedVariables())

    getVariables: (data, event)=>
      $('[id^=measurement-]').closest('ul').remove()
      @chosenMeasurement(event.target.text)

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
          $("#variables-modal .modal-body").append('<div id="check-all-vars-container"><input id="check-all-vars" type="checkbox" data-bind="checked: checkAllVariables"><label for="check-all-vars">Select All Variables</label></div>')

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
            found = (i for i in @query.variables() when i == v)[0]
            id = 'variable-' + v.toLowerCase().replace(/\s/g, '_')
            $('#variables-modal .modal-body ul').append('<li><input id="' + id + '" type="checkbox" ' + (if found then 'checked="checked"' else '') + '><label for="' + id + '">' + v + '</label></li>')

          # hook up variable checkboxes
          $('.modal-body ul input[type=checkbox]').on 'change', (e) =>
            $('#check-all-vars').prop('checked', $('.modal-body ul input:checkbox').length == $('.modal-body ul input[type=checkbox]:checked').length)

          # add back to measurement
          $('#variables-modal .modal-body').append('<a href="#" id="back-to-measurements">Back to Measurement List</a>')

          # hook up back to measurement
          $('#back-to-measurements').on 'click', (e) =>
            @chosenMeasurement(null)
            @query.measurement(null)
            @query.variables([])
            @getMeasurements()
        complete: =>
          $('#variables-modal').modal('show') unless $('#variables-modal').is(':visible')

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
