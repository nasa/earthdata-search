#= require models/data/collections
#= require models/data/query

models = @edsc.models
data = models.data
ns = models.ui

ns.FullFacetsList = do (ko
                          CollectionFacetsModel = ns.CollectionFacets
                          CollectionsModel = data.Collections
                          extend = $.extend
                        ) ->

  # Map the facet category titles to the CMR params for facet-size
  facet_category_mappings = {
    'Organizations': 'data-center',
    'Processing levels': 'processing-level-id',
    'Keywords': 'science-keywords',
    'Instruments': 'instrument',
    'Platforms': 'platform',
    'Projects': 'project'
  }

  class FullFacetsList
    constructor: ->
      @facetObjects = ko.computed(@_computeSelectedFacets, this, deferEvaluation: true)

      @selectedFacetCategory = ko.observable(null)

      @selectedFacetCategory.subscribe (selectedFacetCategory) =>
        # The observable is disposed of on modal close
        return if selectedFacetCategory == null

        # Ask CMR for stuff
        @_retrieveFacets(selectedFacetCategory)

    _retrieveFacets: (facetCategory) =>
      category_key = facet_category_mappings[facetCategory.title]

      queryModel = facetCategory.queryModel

      queryModel.params().facets_size = {}
      queryModel.params().facets_size[category_key] = 10000

      @collections = new CollectionsModel(queryModel)

      # This method retrieves the collections (and therefore facets)
      @collections.results()

    _computeSelectedFacets: =>
      for facet in @collections.facets.results()
        if facet.title == @selectedFacetCategory().title
          return @_groupFacetsAlphabetically(facet.children())

    # Groups facets by the first character for the UI
    _groupFacetsAlphabetically: (facets) ->
      facets

  exports = FullFacetsList
