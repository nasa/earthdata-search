@edsc.util.plugin = do ($=jQuery, stringUtil=@edsc.util.string) ->

  create = (pluginName, Class) ->
    $.fn[pluginName] = (args...) ->
      if args.length > 0 && typeof args[0] == 'string'
        # Method call
        [method, args...] = args
        result = @map ->
          instance = $.data(this, pluginName)

          if !instance
            console.warn "#{pluginName} not found on element"
            this

          else if /^debug_/.test(method)
            # Calling $el.<pluginName>('debug_attrname') returns the attribute named attrname for
            # debugging purposes
            [x, attr...] = method.split('_')
            instance[attr.join('_')]

          else if method == 'destroy'
            # Special case when calling the 'destroy' method, we also need to remove its data
            $.removeData(this, pluginName)
            instance.destroy() if typeof instance?.destroy == 'function'

          else if !/^_/.test(method) && typeof instance?[method] == 'function'
            # Calling $el.<pluginName>(method, args...) calls the given method passing the given args
            instance[method](args...)
          else
            console.error "Could not call #{method} on #{pluginName} instance:", this
            null
        result[0]
      else if args.length < 2
        @each ->
          # Constructor call
          options = args[0]
          # Prevent multiple instantiations
          unless $.data(this, pluginName)?
            $.data(this, pluginName, new Class($(this), pluginName, options))
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
