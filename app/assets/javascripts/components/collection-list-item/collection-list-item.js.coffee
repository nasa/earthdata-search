do (ko) ->
  ko.components.register 'collection-list-item', {
    viewModel: (params) ->
      return params.model
    template: { element: 'tmpl_collection-list-item' },
  }
