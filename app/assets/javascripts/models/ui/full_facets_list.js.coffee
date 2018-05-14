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

  facet_category_mappings = {
    'Organizations': 'data-center',
    'Processing levels': 'processing-level-id',
    'Keywords': 'science-keywords',
    'Instruments': 'instrument',
    'Platforms': 'platform',
    'Projects': 'project'
  }

  class FullFacetsList
    constructor: (@query, selectedFacetCategory) ->
      @query = query

      # @query.params().facets_size = {
      #   'data-center': 10000,
      #   'processing-level-id': 10000,
      #   'science-keywords': 10000,
      #   'instrument': 10000,
      #   'platform': 10000,
      #   'project': 10000
      # }

      @collections = new CollectionsModel(@query)

      @selectedFacetCategory = ko.observable(selectedFacetCategory)

    toggleFullFacetsModal: (facetsModel) =>

      @selectedFacetCategory(facetsModel)

      console.log(@selectedFacetCategory())

      # Update the params to retrieve all of the facets for the selected category
      category_key = facet_category_mappings[@selectedFacetCategory().title]
      @query.params().facets_size = {}
      @query.params().facets_size[category_key] = 10000

      # This method retrieves the collections (and therefore facets)
      @collections.results()

      $('#all-facets-modal').modal()

  exports = FullFacetsList
