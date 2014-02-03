#= require models/data/xhr_model

ns = @edsc.models.data

ns.DatasetFacets = do (ko, getJSON=jQuery.getJSON, XhrModel=ns.XhrModel) ->

  class Facet
    constructor: (@parent, item) ->
      @term = item.term
      @count = item.count

      param = @parent.param()
      @isSelected = ko.computed =>
        term = @term()
        for facet in @parent.queryModel.facets()
          return true if facet.term == term && facet.param == param
        return false

  class FacetsListModel
    constructor: (@queryModel, item) ->
      @name = item.name
      @class_name = ko.computed => @name().toLowerCase().replace(' ', '-')
      @param = item.param
      @opened = ko.observable(true)
      @closed = ko.computed => !@opened()

      values = (new Facet(this, value) for value in item.values())

      @values = ko.observable(values)
      @selectedValues = ko.computed(@_loadSelectedValues)

    setValues: (newValues) =>
      facetsByTerm = {}
      for facet in @values()
        facetsByTerm[facet.term()] = facet
      values = []
      for newFacet in newValues
        oldFacet = facetsByTerm[newFacet.term()]
        if oldFacet?
          value = oldFacet
          value.count = newFacet.count()
        else
          value = new Facet(this, newFacet)
        values.push(value)
      @values(values)


    _loadSelectedValues: =>
      facet for facet in @values() when facet.isSelected()

    toggleList: =>
      @opened(!@opened())

  class DatasetFacetsModel extends XhrModel
    constructor: (@queryModel) ->
      super('/dataset_facets.json')
      @results = ko.computed(@_prepareResults)
      @appliedFacets = ko.computed =>
        result for result in @results() when result.selectedValues().length > 0

    _prepareResults: =>
      if ko.isComputed(@results)
        results = @results()
      else
        results = []
      for item in @_searchResponse()
        found = ko.utils.arrayFirst results, (result) ->
          result.name() == item.name()
        if found
          values = item.values()
          value.parent = found for value in item.values
          found.setValues(item.values())
        else
          results.push(new FacetsListModel(@queryModel, item))

      results

    removeFacet: (facet) =>
      term = facet.term()
      param = facet.parent.param()
      @queryModel.facets.remove (queryFacet) ->
        queryFacet.term == term && queryFacet.param == param

    addFacet: (facet) =>
      @queryModel.facets.push(term: facet.term(), param: facet.parent.param())


    toggleFacet: (facet) =>
      if facet.isSelected()
        @removeFacet(facet)
      else
        @addFacet(facet)

  exports = DatasetFacetsModel