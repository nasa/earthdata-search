# = require models/data/variables

ns = @edsc.models.ui

ns.VariableSelector = do (ko
                    window
                    $ = jQuery
                    ajax = @edsc.util.xhr.ajax
                    VariablesModel = @edsc.models.data.Variables
                    QueryModel = @edsc.models.data.query.CollectionQuery) ->

  keywordLevels = ['Category', 'Topic', 'Term', 'VariableLevel1', 'VariableLevel2', 'VariableLevel3', 'DetailedVariable']

  class VariableSelector
    constructor: (@project) ->
      @selectedCollection = ko.observable(null);
      @selectedProjectCollection = ko.observable(null)
      @variables = ko.asyncComputed([], 100, @_retrieveVariables, this, deferEvaluation: true)
      @selectedKeyword = ko.observable(null)
      @keywordMappings = ko.computed(@_computeKeywordMappings, this, deferEvaluation: true)

      @query = new QueryModel()

      $(document).ready(@_onReady)

    _onReady: =>
      # Clean up when the modal is closed
      $('#variable-subsetting-modal').on 'hide.bs.modal', (e) =>
        @wipeObservables()

      # Select All Checkbox
      $(document).on 'click', '.select-all', (e) =>
        if @selectedKeyword()
          for variable in @selectedKeyword().variables
            @handleVariableSelection(variable, e)

    ###*
     * Determine whether or not the currently selected keyword has all of its variables selected
     ###
    hasAllKeywordsSelected: =>
      for variable in @selectedKeyword().variables
        # Return false if ANY of the variables are not selected
        return false unless @selectedProjectCollection().hasSelectedVariable(variable)

      true

    ###*
     * Determine the number of variables that are selected, and within the provided list. 
     ###
    _countSelectedVariables: (listToCheck) ->
      count = 0
      for variable in listToCheck
          if @selectedProjectCollection().indexOfSelectedVariable(variable) != -1
            count++
      count

    ###*
     * Selects the variable being checked
     ###
    handleVariableSelection: (variable, e) =>
      isSelected = $(e.target).is(':checked')

      if isSelected
        @selectedProjectCollection().selectedVariables.push(variable)
      else
        @selectedProjectCollection().selectedVariables.remove(variable)

      # Continue propagation allowing the checkbox to check and un-check itself
      true

    ###*
     * Creates the full navigation structure used in displaying variables grouped by their ScienceKeywords
     ###
    _computeKeywordMappings: =>
      calculatedMappings = {}

      for variable in @variables()
        for keyword in variable.umm().ScienceKeywords
          keywordPath = $.grep((keyword[keywordLevel] for keywordLevel in keywordLevels), Boolean)

          leafNode = keywordPath.pop()
          if !calculatedMappings.hasOwnProperty(leafNode)
            calculatedMappings[leafNode] = []

          calculatedMappings[leafNode].push(variable)

      # Return an array of objects for easier digest from the view
      ({keyword: keyword, selected: @_countSelectedVariables(variables), variables: variables} for keyword, variables of calculatedMappings)

    ###*
     * Pings CMR for full variable metadata for each variable associated with the selectedCollection
     ###
    _retrieveVariables: =>
      # TODO: Move to Collection Model?
      if @selectedCollection()
        # Retreive the variable ids assigned to the collection
        variableIds = @selectedCollection()?.associations()?['variables']

        # Prevent making unnecessary requests
        if variableIds
          VariablesModel.forIds variableIds, @query, (variables) =>
            @variables(variables)

    ###*
     * Sets the currently selected keyword
     ###
    selectKeyword: (selectedKeyword, e) =>
      @selectedKeyword(selectedKeyword)


    ###*
     * Clears the currently selected keyword
     ###
    clearKeyword: (selectedKeyword, e) =>
      @selectedKeyword(null)

    ###*
     * Assign a variable to a nested navigation structure
     * @param {object} Collection object assigned to the card this modal was initiated from
     ###
    displayModal: (collection) =>
      @selectedCollection(collection)

      @selectedProjectCollection(@project.getProjectCollection(collection.id))

      $('#variable-subsetting-modal').modal('show')

    ###*
     * Cleanup obversables
     ###
    wipeObservables: =>
      @selectedKeyword(null)

  exports = VariableSelector
