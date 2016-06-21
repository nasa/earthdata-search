
@edsc.models.data.GranuleAttributes = do (ko, dateUtil = @edsc.util.date) ->
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
        if value?.length > 0
          result ?= []
          result.push(value.join(','))
      result

    _writeQueryCondition: (conditions) ->
      return unless @_definitions()
      unless conditions
        conditions = []
        for def in @_definitions()
          def.error(null)
          def.value(null)

      for condition, i in conditions
        condition = []
        parts = conditions[i].split(',')
        values = @_unescapeComma(parts.slice(2).join(' - '))
        condition.push parts[0]
        condition.push parts[1]
        condition.push values

        definitions = @_definitions()
        for def in definitions
          if def.name == condition[1]
            def.error(null)
            def.value(@_fromQuery(def, condition))

    _fromQuery: (def, condition) ->
      if condition[1] == def.name
        if condition.length == 4
          return [condition[2], condition[3]].join(' - ').trim()
        else
          return condition[2]
      null

    _toQuery: (def) ->
      result = []
      value = def.value()
      value = ("" + value).trim() if value?
      if value
        result.push def.type.toLowerCase()
        result.push @_escapeComma(def.name)
        if def.type == 'STRING'
          result.push @_escapeComma(value)
        else
          values = value.split(/(?:^|\s)-(?:\s|$)/g)
          if values.length == 1
            result.push @_escapeComma(value)
          else if values.length == 2
            min = values[0].trim()
            max = values[1].trim()
            result.push @_escapeComma(min)
            result.push @_escapeComma(max)
          else
            result.push values

      error = @_errorFor(def, result)
      def.error(error)
      result = null if error
      result

    _escapeComma: (str) ->
      str.replace(/,/g, '\\,')

    _unescapeComma: (str) ->
      str.replace(/\\,/g, ',')

    _errorFor: (def, result) ->
      type = def.type
      return null if !result || type.indexOf('STRING') != -1

      return 'Ranges must only contain two values' if result.length > 4

      for elem, i in result when i > 1
        validation = this["_validate#{result[0].toUpperCase()}"]?(result[i])
        if validation
          return validation.error if validation.error
          result[i] = validation.value
        return "Values must be greater than #{def.begin}" if def.begin && result[i] < def.begin
        return "Values must be less than #{def.end}" if def.end && result[i] > def.end

      if result[2] && result[3] && result[2] > result[3]
        return "Range minimum must be less than maximum"

      null

    _validateINT: (valueStr) ->
      return {value: null, error: null} if valueStr == ""
      value = +valueStr
      error = "Invalid integer: #{@_unescapeComma(valueStr)}" if isNaN(value) || Math.round(value) != value
      {value: value, error: error}

    _validateFLOAT: (valueStr) ->
      value = +valueStr
      error = "Invalid float: #{@_unescapeComma(valueStr)}" if isNaN(value)
      {value: value, error: error}

    _validateDATETIME: (valueStr, type="date/time") ->
      time = Date.parse(valueStr)
      value = dateUtil.toISOString(time) unless isNaN(time)
      error = "Invalid #{type}: #{@_unescapeComma(valueStr)}" if isNaN(time)
      {value: value, error: error}

    _validateTIME: (valueStr) ->
      error = "Invalid time: #{@_unescapeComma(valueStr)}" unless valueStr.match(/^\d{2}:\d{2}:\d{2}/)
      {value: valueStr, error: error}

    _validateDATE: (valueStr) ->
      result = @_validateDATETIME(valueStr, 'date')
      result.value = result.value.split('T')[0] if result.value?
      result


  exports = GranuleAttributes
