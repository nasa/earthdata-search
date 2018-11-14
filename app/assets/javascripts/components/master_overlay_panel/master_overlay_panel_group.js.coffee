do ($=jQuery, ko) ->
  ko.components.register 'master-overlay-panel-group', {
    viewModel: {
      createViewModel: (params, componentInfo) =>

        isActive = ko.observable(params.isActive)
        activeItem = ko.observable(params.activeItem)
        backToButton = ko.observable(undefined)
        items = ko.observableArray([])
        primaryTitle = ko.observable('')
        secondaryTitle = ko.observable('')

        return {
          isActive,
          activeItem,
          backToButton,
          items,
          primaryTitle,
          secondaryTitle
        }
    }
    template: { element: 'tmpl_master-overlay-panel-group' },
  }

  ko.bindingHandlers.componentMasterOverlayPanelGroup = {
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
      element = $(element)
      element.closeButton = element.find('.master-overlay-panel-group-close')
      element.activeCssClass = 'master-overlay-panel-active'
      element.initializedCssClass = 'master-overlay-panel-initialized'

      # Add the class so we can show the contents of the panel items
      element.addClass(element.initializedCssClass)

      # Set the currently active item
      bindingContext.$data.updateActiveItem = (itemName) ->
        bindingContext.$data.activeItem(itemName)

      # Calculates whether or not we should display the back button to the user
      bindingContext.$data.displayBackButton = (data) ->
        for item in data.items()
          if ko.contextFor(item.element[0]).$data.backToButton() && ko.contextFor(item.element[0]).$data.isActive()
            bindingContext.$data.backToButton ko.contextFor(item.element[0]).$data.backToButton()

      # Fire the open-item event to switch to the previous panel
      bindingContext.$data.onBackButtonClick = (event) ->
        element.trigger 'open-item', bindingContext.$data.backToButton().dest

      # Detect clicks on the body in order to close the panel when a user clicks outside of the master overlay parent
      bindingContext.$data.onBodyClick = (event) ->
        element.trigger 'close-panel'
        event.stopPropagation()

      # If a click is within the master overlay parent, stop propogation to prevent the click from reaching the body and closing the panel
      bindingContext.$data.onMasterOverlayParentClick = (event) ->
        if ($(event.target).parents($(event.target)) && $(event.target).is($(event.target)))
          event.stopPropagation()

      # Trigger the pannel close when the close button is clicked
      ko.utils.registerEventHandler element.closeButton, 'click', (event) ->
        element.trigger 'close-panel'

      # Handle the open event
      ko.utils.registerEventHandler element, 'open-panel', (event) ->
        $('.master-overlay-parent').on 'click', bindingContext.$data.onMasterOverlayParentClick
        $('body').on 'click', bindingContext.$data.onBodyClick
        bindingContext.$data.isActive true

      # Handle the close event
      ko.utils.registerEventHandler element, 'close-panel', (event) ->
        $('.master-overlay-parent').off 'click', bindingContext.$data.onMasterOverlayParentClick
        $('body').off 'click', bindingContext.$data.onBodyClick
        bindingContext.$data.isActive false

      # Handle the toggle event
      ko.utils.registerEventHandler element, 'toggle-panel', (event) ->
        console.log 'firing', bindingContext.$data.isActive
        if (bindingContext.$data.isActive())
          $(element).trigger('close-panel')
        else
          $(element).trigger('open-panel')

      # Handle the open-item event
      ko.utils.registerEventHandler element, 'open-item', (event, itemName) ->
        if itemName?
          bindingContext.$data.activeItem itemName

    update: (element, valueAccessor, allBindings, viewModel, bindingContext) ->

      # Loop through the current items to see which should be active by matching the activeItem to the current itemName, then set the
      # isActive flag on that item. If this item is inactive, do the inverse.
      if bindingContext.$data.activeItem()
        for item in bindingContext.$data.items()
          itemContext = ko.contextFor item.element[0]
          if bindingContext.$data.activeItem() == item.itemName()
            itemContext = ko.contextFor item.element[0]

            # Set the isActive flag on the child item
            itemContext.$data.isActive true

            # Detirmine if the back button should be shown
            bindingContext.$data.backToButton itemContext.$data.backToButton()

            # Update the active panels titles
            bindingContext.$data.primaryTitle(itemContext.$data.primaryTitle())
            bindingContext.$data.secondaryTitle(itemContext.$data.secondaryTitle())
          else

            # Otherwise, hide the panel
            itemContext.$data.isActive false
  }
