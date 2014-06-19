
@edsc.models.data.GranuleAttributes = do (ko) ->
  class GranuleAttributes
    constructor: (definitions) ->
      @_definitions = ko.observable([])
      @definitions(definitions) if definitions
      @queryCondition = ko.computed(read: @_readQueryCondition, write: @_writeQueryCondition, owner: this)

    definitions: (definitions) ->
      for attr in definitions ? []
        attr.value ?= ko.observable(null)
        attr.error ?= ko.observable(null)
      @_definitions(definitions)

    isValid: ->
      for def in @_definitions()
        return false if def.error()
      true

    _readQueryCondition: ->
      result = null
      definitions = @_definitions()
      for def in definitions ? []
        value = @_toQuery(def)
        if value?
          result ?= []
          result.push(value)
      result

    _writeQueryCondition: (condition) ->
      return unless @_definitions()
      condition = [] unless condition

      definitions = @_definitions()
      for def in definitions
        def.error(null)
        def.value(@_fromQuery(def, condition))

    _fromQuery: (def, conditions) ->
      for condition in conditions when condition.name == def.name
        {minValue, maxValue, value} = condition
        return [minValue, maxValue].join(' - ').trim() if minValue? || maxValue?
        return value
      null

    _toQuery: (def) ->
      result = null
      value = def.value()
      value = ("" + value).trim() if value?
      if value
        result = {name: def.name, type: def.type.toLowerCase()}
        if def.type == 'STRING'
          result.value = value
        else
          values = value.split(/(?:^|\s)-(?:\s|$)/g)
          if values.length == 1
            result.value = value
          else if values.length == 2
            min = values[0].trim()
            max = values[1].trim()
            result.minValue = min if min
            result.maxValue = max if max
          else
            result.values = values

      error = @_errorFor(def, result)
      def.error(error)
      result = null if error
      result

    _errorFor: (def, result) ->
      type = def.type
      return null if !result || type.indexOf('STRING') != -1

      return 'Ranges must only contain two values' if result.values?

      for prop in ['value', 'minValue', 'maxValue']
        if result[prop]
          validation = this["_validate#{type}"]?(result[prop])
          if validation
            return validation.error if validation.error
            result[prop] = validation.value
          return "Values must be greater than #{def.begin}" if def.begin && result[prop] < def.begin
          return "Values must be less than #{def.end}" if def.end && result[prop] > def.end

      if result.minValue && result.maxValue && result.minValue > result.maxValue
        return "Range minimum must be less than maximum"

      null

    _validateINT: (valueStr) ->
      value = +valueStr
      error = "Invalid integer: #{valueStr}" if isNaN(value) || Math.round(value) != value
      {value: value, error: error}

    _validateFLOAT: (valueStr) ->
      value = +valueStr
      error = "Invalid float: #{valueStr}" if isNaN(value)
      {value: value, error: error}

    _validateDATETIME: (valueStr, type="date/time") ->
      time = Date.parse(valueStr)
      value = new Date(time).toISOString() unless isNaN(time)
      error = "Invalid #{type}: #{valueStr}" if isNaN(time)
      {value: value, error: error}

    _validateTIME: (valueStr) ->
      error = "Invalid time: #{valueStr}" unless valueStr.match(/^\d{2}:\d{2}:\d{2}/)
      {value: valueStr, error: error}

    _validateDATE: (valueStr) ->
      result = @_validateDATETIME(valueStr, 'date')
      result.value = result.value.split('T')[0] if result.value?
      result


  exports = GranuleAttributes
