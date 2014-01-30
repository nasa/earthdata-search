#= require models/data/xhr_model

ns = @edsc.models.data

ns.DatasetFacets = do (ko, getJSON=jQuery.getJSON, XhrModel=ns.XhrModel) ->

  class FacetsListModel
    constructor: ->
      @name = ko.observable("")
      @class_name = ko.computed => @name().toLowerCase().replace(' ', '-')
      @opened = ko.observable(true)
      @closed = ko.computed => !@opened()
      @values = ko.observable([])

    toggleList: =>
      @opened(!@opened())

  class DatasetFacetsModel extends XhrModel
    constructor: (@queryModel) ->
      super('/dataset_facets.json')
      @results = ko.computed(@_prepareResults)

    _prepareResults: =>
      results = @results
      if ko.isComputed(results)
        results = results()
      else
        results = []
      for item in @_searchResponse.results()
        found = ko.utils.arrayFirst results, (result) ->
          if result.name() == item[0]
            values = item[1].sort (l, r) ->
              if l.term() > r.term() then 1 else -1
            result.values(values)
        unless found
          result = new FacetsListModel()
          result.name(item[0])
          values = item[1].sort (l, r) ->
            if l.term() > r.term() then 1 else -1
          result.values(values)
          results.push result

      results

    loadFacet: (facet_type, facet, event) =>
      facet_query = {type: facet_type, name: facet}
      facets = @queryModel.facets
      found = ko.utils.arrayFirst facets(), (item) ->
        #returns either null or the found facet
        facet_query.type == item.type and facet_query.name == item.name
      if !found
        facets.push(facet_query)
      else
        # facets.remove(facet_query) did not remove the item, but
        # facets.remove(found) does
        facets.remove(found)

    highlightFacet: (type, facet) =>
      applied_facets = @queryModel.facets()
      found = ko.utils.arrayFirst applied_facets, (item) ->
        #returns either null or the found facet
        type == item.type and facet() == item.name
      if !found
        false
      else
        true

    applied_facets: () =>
      facets = @queryModel.facets()
      # don't want to shift all the items out of the facet query
      facets_copy = ko.observableArray(facets.slice(0))
      results = []
      while temp = facets_copy.shift()
        type = temp.type
        found = ko.utils.arrayFirst results, (item) ->
          item.type == type

        if !found
          results.push {type: type, values: [temp.name]}
        else
          found.values.push(temp.name)

      results

  exports = DatasetFacetsModel