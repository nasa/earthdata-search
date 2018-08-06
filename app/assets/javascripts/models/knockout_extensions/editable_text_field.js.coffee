do (ko, $=jQuery) ->
    ko.bindingHandlers.editableTextField =
      init: (element, valueAccessor) ->
        value = valueAccessor()
        element = $(element)

        editing = value.editing || false

        # Select all of the elements we will need to interact with. These elements should be found within
        # the element that is triggering the custom binding.
        input = element.find('.editable-text-input')
        textElement = element.find('.editable-text-content')
        editButton = element.find('.editable-text-button-edit')
        formControls = element.find('.editable-text-form-controls')
        submitButton = element.find('.editable-text-button-submit')
        cancelButton = element.find('.editable-text-button-cancel')
        textWrapper = element.find('.editable-text-text-wrapper')
        editWrapper =  element.find('.editable-text-edit-wrapper')
        wrapper = element.find('.editable-text-wrapper')

        # Setting some vars to track the edit action timer. This is used to toggle the visibility
        # of the edit actions after a period of inactivity
        editActionTimer = null
        editActionDelay = 5000

        # Set the inital value of the text element
        textElement.text value.initialValue()

        # Defining some user triggered actions
        element.onEditSubmit = ->
          value.submitCallback()
          element.unbindEditingEvents()
          element.toggleEditControls false
          element.stopTimer editActionTimer

        element.onEditCancel = ->
          element.trigger 'edit', [false]
          element.unbindEditingEvents()
          element.toggleEditControls false
          element.stopTimer editActionTimer

        element.onEdit = ->
          element.trigger 'edit', [true]
          element.toggleEditControls false
          input.focus()
          input.select()
          element.registerEditingEvents()
          element.startEditActionTimer()

        # Registering events that should always live on the page
        element.registerEvents = () ->
          input.on 'input', element.onInputChange
          input.on 'blur', element.onInputBlur
          editButton.on 'click', element.onEditButtonClick
          submitButton.on 'click', element.onSubmitButtonClick
          cancelButton.on 'click', element.onCancelButtonClick
          textElement.on 'click', element.onTextElementClick


        # Registering events that should only be active while in the editing state
        element.registerEditingEvents = () ->
          $(document).on 'keyup', element.onKeyUp
          $(document).on 'mouseup', element.onMouseUp
          submitButton.on 'focusin', element.onEditContolFocusIn
          submitButton.on 'focusout', element.onEditContolFocusOut
          cancelButton.on 'focusin', element.onEditContolFocusIn
          cancelButton.on 'focusout', element.onEditContolFocusOut

        # Unbinding events triggered when the element is destroyed
        element.unbindEvents = () ->
          element.unbindEditingEvents()
          input.unbind 'input', element.onInputChange
          input.unbind 'blur', element.onInputBlur
          editButton.unbind 'click', element.onEditButtonClick
          submitButton.unbind 'click', element.onSubmitButtonClick
          cancelButton.unbind 'click', element.onCancelButtonClick
          textElement.unbind 'click', element.onTextElementClick

        # Unbinding events triggered on input submission or cancel
        element.unbindEditingEvents = () ->
          $(document).unbind 'keyup', element.onKeyUp
          $(document).unbind 'mouseup', element.onMouseUp
          submitButton.unbind 'focusin', element.onEditContolFocusIn
          submitButton.unbind 'focusout', element.onEditContolFocusOut
          cancelButton.unbind 'focusin', element.onEditContolFocusIn
          cancelButton.unbind 'focusout', element.onEditContolFocusOut

        # Defining events to be used in the event handlers
        element.onInputChange = (e) ->
          element.resizeInput()
          element.stopTimer editActionTimer
          element.startEditActionTimer()

        element.onInputBlur = (e) ->
          element.resizeInput()

        element.onTextElementClick = (e) ->
          element.onEdit()
          element.resizeInput()

        element.onEditButtonClick = (e) ->
          element.onEdit()
          element.resizeInput()

        element.onSubmitButtonClick = (event) ->
          element.onEditSubmit()
          event.preventDefault()

        element.onCancelButtonClick = ->
          element.onEditCancel()

        element.onKeyUp = (e) ->
          if e.which == 27
            element.onEditCancel()

        element.onMouseUp = (e) ->
          if element.isClickOutside(e)
            element.onEditCancel()

        element.onEditContolFocusIn = () ->
          element.toggleEditControls true

        element.onEditContolFocusOut = () ->
          element.toggleEditControls false

        # Creates a timer
        element.startTimer = (delay, callback, callbackArgs) ->
          timer = setTimeout ->
            callback.apply(this, callbackArgs)
          , delay
          timer

        # Ends a timer
        element.stopTimer = (timer) ->
          clearTimeout(timer)

        # End the current timer for the edit actions and start a new one. This is fired when the user
        # triggers the edit state, or upon changing the value of the input
        element.startEditActionTimer = ->
          element.stopTimer editActionTimer
          editActionTimer = element.startTimer editActionDelay, element.toggleEditControls, [true]

        # Resizing the text input to the size of the current value
        element.resizeInput = () ->
          rulerClasses = {
            'position': 'absolute',
            'white-space': 'pre',
            'opacity': 0,
            'visibility': 'hidden'
          }

          # Here we create a dummy element and append it to the current container.
          # We then grab the compute the size and immediately delete the cloned \
          # element. The size is then applied to the input element.
          ruler = textElement.clone()
          ruler.css(rulerClasses)
          ruler.html input.val()
          wrapper.append ruler
          newWidth = ruler[0].clientWidth
          ruler.remove()
          input.width newWidth + 1

        element.isClickOutside = (event) ->
          !input.is(event.target) && input.has(event.target).length == 0

        element.toggleEditControls = (showControls) ->
          if showControls
            formControls.removeClass 'visually-hidden'
          else
            formControls.addClass 'visually-hidden'

        element.on 'edit', (e, editing) ->
          textElement.text value.initialValue()
          input.val value.initialValue()
          element.resizeInput()

          if editing
            editWrapper.addClass 'is-active'
            textWrapper.removeClass 'is-active'
          else
            textWrapper.addClass 'is-active'
            editWrapper.removeClass 'is-active'

        element.on 'submit', () ->
          editButton.hide()

        element.on 'success', () ->
          element.trigger 'edit', [false, value.initialValue()]
          setTimeout ->
            editButton.fadeIn()
          , 2500

        element.registerEvents()

        ko.utils.domNodeDisposal.addDisposeCallback element, ->
          element.unbindEvents()


      update: (element, valueAccessor) ->
        element = $(element)
        value = valueAccessor()

        element.trigger 'edit', [ value.editing = false, value.initialValue() ]
