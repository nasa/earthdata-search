do (ko) ->
  ko.components.register 'master-overlay-panel', {
    viewModel: {
      createViewModel: (params, componentInfo) =>
        return {}
    }
    template: { element: 'tmpl_master-overlay-panel' },
  }
