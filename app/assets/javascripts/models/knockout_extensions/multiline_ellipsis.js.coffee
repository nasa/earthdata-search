do (ko, $=jQuery) ->

  # Multiline Ellpsis trims a line of text based on the size of the wrapping element and adds an ellipisis.
  # This handler expects to be called on a parent element with a single child containing text. The maximum size
  # is determined by setting a css 'max-height' property on the parent element. This should not be used for
  # extremely large pieces of text as performance could be an issue.
  #
  # Example css:
  # .parent { max-height: 50px, overflow: hidden }
  # .child  { ...child text styles }
  #
  # https://stackoverflow.com/questions/3404508/cross-browser-multi-line-text-overflow-with-ellipsis-appended-within-a-width-and

  ko.bindingHandlers.multilineEllipsis =
    update: (element, valueAccessor) ->
      parent = $(element)
      child = parent.children()
      value = valueAccessor()
      text = value.text

      # Apply the text to the child
      child.text =>
        text

      # Get the height of the parent with the text applied
      parentHeight = parent.height()

      # Set the title attibute of the child to the full text
      child.attr 'title', text

      while child.outerHeight() > parentHeight
        child.text (index, text) =>
          text.replace(/\W*\s(\S)*$/, '...')
