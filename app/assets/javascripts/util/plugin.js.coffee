@edsc.util.plugin = do (document, $=jQuery, stringUtil=@edsc.util.string) ->

  clickHandler = (pluginName, method, rootSelector, dataArg) ->
    (e) ->
      $this = $(this)
      if $this.is('a') || $(e.target).closest('a').length == 0
        $root = $this.closest(rootSelector)
        if $root.length == 0
          href = $this.attr('href')
          $root = $(href) if href? && href.length > 1

        $root[pluginName](method, $this.attr(dataArg))
        e.preventDefault()
        e.stopPropagation()
      false


  # Sets up onclick handlers
  setupClickHandlers = (pluginName, Class) ->
    specialMethods = ['constructor', 'destroy']
    $document = $(document)
    prefix = stringUtil.dasherize(pluginName)
    rootSelector = ".#{prefix}"

    for own method, fn of Class.prototype
      unless method in specialMethods || method.indexOf('_') == 0
        classname = "#{prefix}-#{stringUtil.dasherize(method)}"

        selector = ".#{classname}"
        handler = clickHandler(pluginName, method, rootSelector, "data-#{classname}")
        $document.on 'click', selector, handler

  create = (pluginName, Class) ->
    setupClickHandlers(pluginName, Class) unless Class.noClickHandlers

    $.fn[pluginName] = (args...) ->
      if args.length > 0 && typeof args[0] == 'string'
        # Method call
        [method, args...] = args
        result = for el in this
          instance = $.data(el, pluginName)

          if !instance
            console.warn "#{pluginName} not found on element"
            el

          else if /^debug_/.test(method)
            # Calling $el.<pluginName>('debug_attrname') returns the attribute named attrname for
            # debugging purposes
            [x, attr...] = method.split('_')
            instance[attr.join('_')]

          else if method == 'destroy'
            # Special case when calling the 'destroy' method, we also need to remove its data
            $.removeData(el, pluginName)
            instance.destroy() if typeof instance?.destroy == 'function'

          else if !/^_/.test(method) && typeof instance?[method] == 'function'
            # Calling $el.<pluginName>(method, args...) calls the given method passing the given args
            instance[method](args...)
          else
            console.error "Could not call #{method} on #{pluginName} instance:", el
            null
        result[0]
      else if args.length < 2
        @each ->
          # Constructor call
          options = args[0]
          # Prevent multiple instantiations
          unless $.data(this, pluginName)?
            obj = new Class($(this), pluginName, options)
            $.data(this, pluginName, obj)
      else
        console.error "Bad arguments to #{pluginName}:", args
        this

  class Base
    constructor: (@root, @namespace, @_options) ->
      @cssScope = stringUtil.dasherize(@namespace)

    destroy: ->

    scope: (name, options={}) ->
      prefixes = ['.', 'is-']

      before = ""
      for prefix in prefixes when name.indexOf(prefix) == 0
        before += prefix
        name = name.substring(prefix.length)

      "#{before}#{@cssScope}-#{name}"

    scopedEventName: (name) ->
      "#{@namespace}.#{name}"

  exports =
    create: create
    Base: Base
