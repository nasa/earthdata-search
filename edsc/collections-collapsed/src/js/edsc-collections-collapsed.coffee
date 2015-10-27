require '../css/collections-collapsed.less'
{extend} = require('core')

class CollectionsCollapsedModel
  constructor: (params) ->
    @params = params
    extend(this, params)

class CollectionCollapsedModel
  constructor: (params) ->
    @params = params
    extend(this, params)

ko.components.register 'edsc-collections-collapsed',
  viewModel: (params) -> new CollectionsCollapsedModel(params)
  template: require('../html/collections-collapsed.html')

ko.components.register 'edsc-collection-collapsed',
  viewModel: (collection) -> new CollectionCollapsedModel(collection)
  template: require('../html/collection-collapsed.html')
