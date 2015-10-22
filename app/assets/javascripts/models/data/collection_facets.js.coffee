#= require models/data/xhr_model

ns = @edsc.models.data

ns.CollectionFacets = do (ko) ->

  # Note: This minifies poorly
  sk_facet_order = [
#    'science_keywords[0][category][]',
    'science_keywords[0][topic][]',
    'science_keywords[0][term][]',
    'science_keywords[0][variable_level_1][]',
    'science_keywords[0][variable_level_2][]',
    'science_keywords[0][variable_level_3][]',
    'science_keywords[0][detailed_variable][]'
  ]

  class Facet
    constructor: (@parent, item) ->
      @term = item.term
      @count = ko.observable(item.count)
      @param = item.param || parent.param

    isSelected: ->
      term = @term
      param = @param
      for facet in @parent.queryModel.facets()
        return true if facet.term == term && facet.param == param
      return false

    isChild: ->
      @isHierarchical() && !@isAncestor() && @hierarchyIndex() > 0

    isParent: ->
      @isScienceKeywordParent()

    isAncestor: ->
      @isHierarchical() && @isSelected()

    isScienceKeyword: ->
      @param.indexOf('sci') == 0

    isScienceKeywordParent: ->
      (@isAncestor() &&
       @hierarchyIndex() >= @parent.queryModel.scienceKeywordFacets().length - 1)

    isHierarchical: ->
      @isScienceKeyword()

    hierarchyIndex: ->
      sk_facet_order.indexOf(@param)

    equals: (other) ->
      other && other.term == @term && other.param == @param

  class FacetsListModel
    constructor: (@queryModel, item) ->
      @name = item.name
      @class_name = ko.computed => @name.toLowerCase().replace(' ', '-')
      @param = item.param

      values = (new Facet(this, value) for value in item.values)

      @values = ko.observable(values)
      @selectedValues = ko.computed(@_loadSelectedValues)

      isDefaultOpened = (@selectedValues().length > 0 ||
                         item.name == 'Keywords' ||
                         item.name == 'Features')
      @opened = ko.observable(isDefaultOpened)
      @closed = ko.computed => !@opened()

    setValues: (newValues) =>
      facetsByTerm = {}
      for facet in @values()
        facetsByTerm[facet.term] = facet
      values = []
      for newFacetData in newValues
        oldFacet = facetsByTerm[newFacetData.term]
        newFacet = new Facet(this, newFacetData)
        if newFacet.equals(oldFacet)
          oldFacet.count(newFacetData.count)
          values.push(oldFacet)
        else
          values.push(newFacet)
      @values(values)

    _loadSelectedValues: =>
      facet for facet in @values() when facet.isSelected()

    removeHierarchyBelow: (facet) ->
      index = facet.hierarchyIndex()
      removed = (v for v in @values() when v.hierarchyIndex() > index)
      @values(v for v in @values() when v.hierarchyIndex() <= index)
      removed

    toggleList: =>
      @opened(!@opened())

  class CollectionFacetsModel
    constructor: (query) ->
      @query = query
      @isRelevant = ko.observable(false)
      @appliedFacets = ko.computed(@_computeAppliedFacets, this, deferEvaluation: true)
      @results = ko.observable([])

    _computeAppliedFacets: ->
      result for result in @results() when result.selectedValues().length > 0

    update: (data) ->
      current = @results.peek()
      for item in data
        found = ko.utils.arrayFirst current, (result) ->
          result.name == item.name
        if found
          values = item.values
          value.parent = found for value in item.values
          found.setValues(item.values)
        else
          current.push(new FacetsListModel(@query, item))

      @results(current)
      current

    removeFacet: (facet) =>
      @_removeSingleFacet(facet)
      for facet in facet.parent.removeHierarchyBelow(facet) when facet.isSelected()
        @_removeSingleFacet(facet)

    _removeSingleFacet: (facet) ->
      term = facet.term
      param = facet.param
      @query.facets.remove (queryFacet) ->
        queryFacet.term == term && queryFacet.param == param

    addFacet: (facet) =>
      @query.facets([]) unless @query.facets()?
      @query.facets.push(term: facet.term, param: facet.param)

    toggleFacet: (facet) =>
      if facet.isSelected()
        @removeFacet(facet)
      else
        @addFacet(facet)

  exports = CollectionFacetsModel
