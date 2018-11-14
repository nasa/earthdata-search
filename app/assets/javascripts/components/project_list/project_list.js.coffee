do ($=jQuery, ko) ->
  ko.components.register 'project-list', {
    viewModel: {
      createViewModel: (params, componentInfo) =>

        project = params.project

        return {
          project
        }
    }
    template: { element: 'tmpl_project-list' },
  }

  ko.bindingHandlers.componentProjectList = {
      init: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
        #
        # element = $(element)
        # element.activeClass = 'master-overlay-panel-item-active'
        # element.itemName = bindingContext.$data.itemName
        #
        # # Add the current item to the parent panel group's items array
        # addToParent = (itemName, element) =>
        #   bindingContext.$parent.items.push {
        #     itemName,
        #     element
        #   }
        #
        # addToParent element.itemName, element
        #
        # # Sends the open event up to the parent
        # ko.utils.registerEventHandler element, 'open', (e) ->
        #   bindingContext.$parent.updateActiveItem(element.itemName())

      update: (element, valueAccessor, allBindings, viewModel, bindingContext) =>

    }
