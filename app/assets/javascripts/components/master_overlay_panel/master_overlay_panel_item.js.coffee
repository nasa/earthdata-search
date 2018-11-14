do ($=jQuery, ko) ->
  ko.components.register 'master-overlay-panel-item', {
    viewModel: {
      createViewModel: (params, componentInfo) =>

        isActive = ko.observable(params.isActive)
        itemName = ko.observable(params.itemName)
        backToButton = ko.observable(params.backToButton)
        primaryTitle = ko.observable(params.primaryTitle)
        secondaryTitle = ko.observable(params.secondaryTitle)

        return {
          isActive,
          itemName,
          backToButton,
          primaryTitle,
          secondaryTitle
        }
    }
    template: { element: 'tmpl_master-overlay-panel-item' },
  }

  ko.bindingHandlers.componentMasterOverlayPanelItem = {
      init: (element, valueAccessor, allBindings, viewModel, bindingContext) =>

        element = $(element)
        element.activeClass = 'master-overlay-panel-item-active'
        element.itemName = bindingContext.$data.itemName

        # Add the current item to the parent panel group's items array
        addToParent = (itemName, element) =>
          bindingContext.$parent.items.push {
            itemName,
            element
          }

        addToParent element.itemName, element

        # Sends the open event up to the parent
        ko.utils.registerEventHandler element, 'open', (e) ->
          bindingContext.$parent.updateActiveItem(element.itemName())

      update: (element, valueAccessor, allBindings, viewModel, bindingContext) =>

    }
