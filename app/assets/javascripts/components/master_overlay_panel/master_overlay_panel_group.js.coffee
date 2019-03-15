util = @edsc.util

do ($=jQuery, ko) ->
  ko.components.register 'master-overlay-panel-group', {
    viewModel: {
      createViewModel: (params, componentInfo) =>

        panelGroupName = ko.observable(params.panelGroupName)
        isOpen = ko.observable(params.isOpen)
        isActive = ko.observable(params.isActive)
        activeItem = ko.observable(params.activeItem)
        backToButton = ko.observable(undefined)
        items = ko.observableArray([])
        primaryTitle = ko.observable('')
        secondaryTitle = ko.observable('')
        shouldAnimate = ko.observable(true)
        firstRender = ko.observable(true)
        allItemsRendered = ko.observable(false)

        return {
          panelGroupName,
          isOpen,
          isActive,
          activeItem,
          backToButton,
          items,
          primaryTitle,
          secondaryTitle,
          shouldAnimate,
          firstRender,
          allItemsRendered
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
      element.openingCssClass = 'master-overlay-panel-item-opening'
      element.panelsContainer = 'master-overlay-panel-panels'


      # Add the class so we can show the contents of the panel items
      element.addClass(element.initializedCssClass)

      # Add the current item to the parent panel group's items array
      addToParent = (panelGroupName, element) =>
        bindingContext.$parentContext.$component.panelGroups.push {
          panelGroupName,
          element
        }

      addToParent bindingContext.$data.panelGroupName, element

      # Set the currently active item
      bindingContext.$data.updateActiveItem = (itemName) ->
        bindingContext.$data.activeItem(itemName)

      # Calculates whether or not we should display the back button to the user
      bindingContext.$data.displayBackButton = (data) ->
        for item in data.items()
          if ko.contextFor(item.element[0]).$data.backToButton() && ko.contextFor(item.element[0]).$data.isOpen()
            bindingContext.$data.backToButton ko.contextFor(item.element[0]).$data.backToButton()

      # Fire the open-item event to switch to the previous panel
      bindingContext.$data.onBackButtonClick = (event) ->
        context = bindingContext.$data.backToButton()

        if context.dest?
          element.trigger 'open-item', $('#' + bindingContext.$data.backToButton().dest)

        if context.callback?
          context.callback()
          return

      bindingContext.$data.setActivePanelGroup = () ->
        bindingContext.$parentContext.$component.updateActivePanelGroup bindingContext.$data.panelGroupName()

      # Trigger the panel close when the close button is clicked
      ko.utils.registerEventHandler element.closeButton, 'click', (event) ->
        bindingContext.$parentContext.$component.close()

      # Handle the open event
      ko.utils.registerEventHandler element, 'open-panel', (event) ->
        # $(document).on 'click', bindingContext.$data.onOutsideClick
        $(element).addClass(element.openingCssClass)
        $(element).one(util.which_transtion_event.type, (event) ->
          $(element).removeClass(element.openingCssClass)
        )

        # Update the currently active panel group
        bindingContext.$data.setActivePanelGroup()
        bindingContext.$data.isOpen true

      # Handle the close event
      ko.utils.registerEventHandler element, 'close-panel', (event) ->
        # Reset the animation flag and close the panel
        bindingContext.$data.shouldAnimate true
        bindingContext.$data.isOpen false

      # Handle the toggle event
      ko.utils.registerEventHandler element, 'toggle-panel', (event) ->
        # Prevent the animation if there is already an active panel
        if bindingContext.$parentContext.$component.activePanelGroup()
          bindingContext.$data.shouldAnimate false

        if bindingContext.$data.isOpen()
          # If the triggered panel is already open, and its not currently the active panel, set it to the active panel,
          # otherwise close the parent panel component
          if bindingContext.$parentContext.$component.activePanelGroup() != bindingContext.$data.panelGroupName()
            bindingContext.$data.setActivePanelGroup()
            return
          else
            bindingContext.$parentContext.$component.close()
        else
          $(element).trigger('open-panel')

      # Handle the open-item event
      ko.utils.registerEventHandler element, 'open-item', (event, element) ->
        if element
          itemContext = ko.contextFor(element)
          bindingContext.$data.activeItem itemContext.$data.itemName()

          # Detirmine if the back button should be shown
          bindingContext.$data.backToButton itemContext.$data.backToButton()

          # Update the active panels titles
          bindingContext.$data.primaryTitle itemContext.$data.primaryTitle()
          bindingContext.$data.secondaryTitle itemContext.$data.secondaryTitle()

          # Set the isActive flag on the child item
          itemContext.$data.isActive true

    update: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
      # Loop through the current items to see which should be active by matching the activeItem to the current itemName, then set the
      # isActive flag on that item. If this item is inactive, do the inverse.
      if bindingContext.$data.activeItem()
        for item in bindingContext.$data.items()
          itemContext = ko.contextFor item.element[0]
          if bindingContext.$data.activeItem() == item.itemName()
            $(element).trigger 'open-item', item.element[0]
          else
            itemContext.$data.isActive false
      else
        items = bindingContext.$data.items()
        if items.length && items[0].element
          $(element).trigger 'open-item', items[0].element[0]

      ko.utils.registerEventHandler $('.master-overlay-panel-panels, .master-overlay-panel-panels .variable-selection'), 'scroll', (e) ->
        if $(e.target).scrollTop() > 20
          $('.master-overlay-panel-panels').addClass('master-overlay-panel-panels-scrolled')
        else
          $('.master-overlay-panel-panels').removeClass('master-overlay-panel-panels-scrolled')

      if bindingContext.$data.firstRender() and \
         bindingContext.$data.items().length and \
         bindingContext.$data.items().length == $(element).find('.master-overlay-panel-panels').children().length

        bindingContext.$data.allItemsRendered(true)
        bindingContext.$data.firstRender(false)
  }
