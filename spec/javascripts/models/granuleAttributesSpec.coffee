
describe "GranuleAttributes", ->
  GranuleAttributes = window.edsc.models.data.GranuleAttributes
  extend = jQuery.extend

  makeAttrs = (attrs...) ->
    new GranuleAttributes(extend({name: "attr#{i}", type: "STRING"}, attr) for attr, i in attrs)

  makeAttrsWithValue = (value, attrs...) ->
    result = new GranuleAttributes(extend({name: "attr#{i}", type: "STRING"}, attr) for attr, i in attrs)
    def.value(value) for def in result._definitions()
    result

  getValue = (attrs) ->
    attrs._definitions()[0].value()

  describe '#isValid', ->
    it 'returns false if any field is invalid', ->
      attrs = makeAttrs({}, {type: 'INT'})
      attrs._definitions()[1].value('5 - 1')
      expect(attrs.isValid()).toBe(false)

    it 'returns true if all fields are valid', ->
      attrs = makeAttrs({}, {type: 'INT'})
      attrs._definitions()[1].value('1 - 5')
      expect(attrs.isValid()).toBe(true)

    it 'returns true there are no defined fields', ->
      attrs = makeAttrs()
      expect(attrs.isValid()).toBe(true)

  describe "#queryCondition", ->
    describe "reading", ->
      it "reads nothing when no condition is set", ->
        attrs = makeAttrs({})
        expect(attrs.queryCondition()).toEqual(null)

      it "reads a single condition when a condition is set", ->
        attrs = makeAttrsWithValue('myvalue', {})
        expect(attrs.queryCondition()).toEqual(['string,attr0,myvalue'])

      it "reads multiple conditions when multiple conditions are set", ->
        attrs = makeAttrsWithValue('myvalue', {}, {}, {})
        attrs._definitions()[1].value(null)
        expect(attrs.queryCondition()).toEqual(['string,attr0,myvalue','string,attr2,myvalue'])


    describe "writing", ->
      it "writes nothing when no condition is present in the query", ->
        attrs = makeAttrsWithValue()
        attrs.queryCondition({})
        expect(attrs._definitions().length).toBe(0)

      it "writes a single condition when a condition is present in the query", ->
        attrs = makeAttrs({})
        attrs.queryCondition(['STRING,attr0,myvalue'])
        expect(attrs._definitions()[0].value()).toBe('myvalue')

      it "writes multiple conditions when multiple conditions are present in the query", ->
        attrs = makeAttrs({}, {}, {})
        attrs.queryCondition(['STRING,attr0,myvalue', 'STRING,attr2,myothervalue', ])
        expect(attrs._definitions()[0].value()).toBe('myvalue')
        expect(attrs._definitions()[1].value()).toBe(null)
        expect(attrs._definitions()[2].value()).toBe('myothervalue')

  describe '#_toQuery', ->
    getToQueryValue = (value, type="INT") ->
      attrs = makeAttrsWithValue(value, {type: type})
      attrs._toQuery(attrs._definitions()[0])

    it "ignores empty strings", ->
      expect(getToQueryValue('')).toEqual([])

    it "ignores blank strings", ->
      expect(getToQueryValue('  ')).toEqual([])

    it "ignores null values", ->
      expect(getToQueryValue(null)).toEqual([])

    it "parses values separated by space-dash-space into ranges", ->
      expect(getToQueryValue('1 - 2')).toEqual(['int','attr0',1,2])

    it "parses values beginning with dash-space into ranges with no minValue", ->
      expect(getToQueryValue('- 2')).toEqual(['int','attr0',null,2])

    it "parses values ending with space-dash into ranges with no maxValue", ->
      expect(getToQueryValue('1 -')).toEqual(['int','attr0',1,null])

    it "parses negative number values without creating inappropriate ranges", ->
      expect(getToQueryValue('-1')).toEqual(['int','attr0',-1])

    it "parses negative number values contained in ranges", ->
      expect(getToQueryValue('-2 - -1')).toEqual(['int','attr0',-2,-1])

  describe '#_fromQuery', ->
    getFromQueryValue = (conditions, type="INT") ->
      attrs = makeAttrs({type: type})
      attrs._fromQuery(attrs._definitions()[0], conditions)

    it "reads range values into space-dash-space separated strings", ->
      expect(getFromQueryValue(['int', 'attr0', 1, 2])).toEqual('1 - 2')

    it "reads range values with no minimum into strings beginning with dash-space", ->
      expect(getFromQueryValue(['int', 'attr0', null, 2])).toEqual('- 2')

    it "reads range values with no maximum into strings ending with space-dash", ->
      expect(getFromQueryValue(['int', 'attr0', 1, null])).toEqual('1 -')

  describe "#_errorFor", ->
    getErrorForAttrs = (condition, begin, end) ->
      if condition instanceof Array
        def = {type: condition[0]}
        def.begin = begin if begin
        def.end = end if end
      else
        def = {type: begin || 'STRING'}
        condition = [begin || 'STRING', 'attr0', condition.minValue, condition.maxValue]
      makeAttrs([])._errorFor(def, condition)

    fieldValidationSpecs = (fieldName) ->
      getErrorFor = (condition, begin, end) ->
#        attrs = {}
#        attrs[fieldName] = condition[2]
        getErrorForAttrs(condition, begin, end)

      it "produces an error for invalid integers", ->
        expect(getErrorFor(['INT', 'attr0', '123asdf'])).toEqual('Invalid integer: 123asdf')

      it "produces no error for valid integers", ->
        expect(getErrorFor(['INT', 'attr0', '123'])).toEqual(null)

      it "produces an error for invalid floats", ->
        expect(getErrorFor(['FLOAT', 'attr0', '123asdf'])).toEqual('Invalid float: 123asdf')

      it "produces no error for valid floats", ->
        expect(getErrorFor(['FLOAT', 'attr0', '123.4'])).toEqual(null)

      it "produces an error for invalid dates", ->
        expect(getErrorFor(['DATE', 'attr0', '123asdf'])).toEqual('Invalid date: 123asdf')

      it "produces no error for valid dates", ->
        expect(getErrorFor(['DATE', 'attr0', '2014-01-01'])).toEqual(null)

      it "produces an error for invalid times", ->
        expect(getErrorFor(['TIME', 'attr0', '123asdf'])).toEqual('Invalid time: 123asdf')

      it "produces no error for valid times", ->
        expect(getErrorFor(['TIME', 'attr0', '00:00:00'])).toEqual(null)

      it "produces an error for invalid date/times", ->
        expect(getErrorFor(['DATETIME', 'attr0', '123asdf'])).toEqual('Invalid date/time: 123asdf')

      it "produces no error for valid date/times", ->
        expect(getErrorFor(['DATETIME', 'attr0', '2014-01-01T00:00:00'])).toEqual(null)

      it "produces an error when values are below the allowable minimum", ->
        expect(getErrorFor(['INT', 'attr0', '0'], 1)).toEqual('Values must be greater than 1')

      it "produces no error when values are at the allowable minimum", ->
        expect(getErrorFor(['INT', 'attr0', '1'], 1)).toEqual(null)

      it "produces no error when values are above the allowable minimum", ->
        expect(getErrorFor(['INT', 'attr0', '2'], 1)).toEqual(null)

      it "produces an error when values are above the allowable maximum", ->
        expect(getErrorFor(['INT', 'attr0', '2'], null, 1)).toEqual('Values must be less than 1')

      it "produces no error when values are at the allowable maximum", ->
        expect(getErrorFor(['INT', 'attr0', '1'], null, 1)).toEqual(null)

      it "produces no error when values are below the allowable maximum", ->
        expect(getErrorFor(['INT', 'attr0', '0'], null, 1)).toEqual(null)

    describe "for value fields", -> fieldValidationSpecs('value')
    describe "for minValue fields", -> fieldValidationSpecs('minValue')
    describe "for maxValue fields", -> fieldValidationSpecs('maxValue')

    describe "when both minValue and maxValue are supplied", ->
      it "produces no error when integer minValue is less than maxValue", ->
        expect(getErrorForAttrs({minValue: '2', maxValue: '3'}, 'INT')).toEqual(null)

      it "produces no error when integer minValue is equal to maxValue", ->
        expect(getErrorForAttrs({minValue: '2', maxValue: '2'}, 'INT')).toEqual(null)

      it "produces an error when integer minValue is greater than maxValue", ->
        expect(getErrorForAttrs({minValue: '2', maxValue: '1'}, 'INT')).toEqual('Range minimum must be less than maximum')

      it "produces no error when float minValue is less than maxValue", ->
        expect(getErrorForAttrs({minValue: '1.2', maxValue: '1.3'}, 'FLOAT')).toEqual(null)

      it "produces no error when float minValue is equal to maxValue", ->
        expect(getErrorForAttrs({minValue: '1.2', maxValue: '1.2'}, 'FLOAT')).toEqual(null)

      it "produces an error when float minValue is greater than maxValue", ->
        expect(getErrorForAttrs({minValue: '1.2', maxValue: '1.1'}, 'FLOAT')).toEqual('Range minimum must be less than maximum')

      it "produces no error when date minValue is less than maxValue", ->
        expect(getErrorForAttrs({minValue: '2014-01-02', maxValue: '2014-01-03'}, 'DATE')).toEqual(null)

      it "produces no error when date minValue is equal to maxValue", ->
        expect(getErrorForAttrs({minValue: '2014-01-02', maxValue: '2014-01-02'}, 'DATE')).toEqual(null)

      it "produces an error when date minValue is greater than maxValue", ->
        expect(getErrorForAttrs({minValue: '2014-01-02', maxValue: '2014-01-01'}, 'DATE')).toEqual('Range minimum must be less than maximum')
