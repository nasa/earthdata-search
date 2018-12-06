do ($=jQuery, ko) ->
  ko.components.register 'project-list', {
    viewModel: {
      createViewModel: (params, componentInfo) ->
        project = params.project

        return {
          project
        }
    }
    template: { element: 'tmpl_project-list' },
  }
