
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
        expect(attrs.queryCondition()).toEqual([{name: 'attr0', type: 'string', value: 'myvalue'}])

      it "reads multiple conditions when multiple conditions are set", ->
        attrs = makeAttrsWithValue('myvalue', {}, {}, {})
        attrs._definitions()[1].value(null)
        expect(attrs.queryCondition()).toEqual([{name: 'attr0', type: 'string', value: 'myvalue'}, {name: 'attr2', type: 'string', value: 'myvalue'}])


    describe "writing", ->
      it "writes nothing when no condition is present in the query", ->
        attrs = makeAttrsWithValue()
        attrs.queryCondition({})
        expect(attrs._definitions().length).toBe(0)

      it "writes a single condition when a condition is present in the query", ->
        attrs = makeAttrs({})
        attrs.queryCondition([{name: 'attr0', value: 'myvalue'}])
        expect(attrs._definitions()[0].value()).toBe('myvalue')

      it "writes multiple conditions when multiple conditions are present in the query", ->
        attrs = makeAttrs({}, {}, {})
        attrs.queryCondition([{name: 'attr0', value: 'myvalue'}, {name: 'attr2', value: 'myothervalue'}, ])
        expect(attrs._definitions()[0].value()).toBe('myvalue')
        expect(attrs._definitions()[1].value()).toBe(null)
        expect(attrs._definitions()[2].value()).toBe('myothervalue')

  describe '#_toQuery', ->
    getToQueryValue = (value, type="INT") ->
      attrs = makeAttrsWithValue(value, {type: type})
      attrs._toQuery(attrs._definitions()[0])

    it "ignores empty strings", ->
      expect(getToQueryValue('')).toEqual(null)

    it "ignores blank strings", ->
      expect(getToQueryValue('  ')).toEqual(null)

    it "ignores null values", ->
      expect(getToQueryValue(null)).toEqual(null)

    it "parses values separated by space-dash-space into ranges", ->
      expect(getToQueryValue('1 - 2')).toEqual(name: 'attr0', type: 'int', minValue: 1, maxValue: 2)

    it "parses values beginning with dash-space into ranges with no minValue", ->
      expect(getToQueryValue('- 2')).toEqual(name: 'attr0', type: 'int', maxValue: 2)

    it "parses values ending with space-dash into ranges with no maxValue", ->
      expect(getToQueryValue('1 -')).toEqual(name: 'attr0', type: 'int', minValue: 1)

    it "parses negative number values without creating inappropriate ranges", ->
      expect(getToQueryValue('-1')).toEqual(name: 'attr0', type: 'int', value: -1)

    it "parses negative number values contained in ranges", ->
      expect(getToQueryValue('-2 - -1')).toEqual(name: 'attr0', type: 'int', minValue: -2, maxValue: -1)

    it "normalizes dates to ISO format", ->
      expect(getToQueryValue('2014-07-01 12:00:00', 'DATETIME')).toEqual(name: 'attr0', type: 'datetime', value: '2014-07-01T16:00:00.000Z')

  describe '#_fromQuery', ->
    getFromQueryValue = (conditions, type="INT") ->
      attrs = makeAttrs({type: type})
      attrs._fromQuery(attrs._definitions()[0], conditions)

    it "reads range values into space-dash-space separated strings", ->
      expect(getFromQueryValue([{name: 'attr0', type: "int", minValue: '1', maxValue: '2'}])).toEqual('1 - 2')

    it "reads range values with no minimum into strings beginning with dash-space", ->
      expect(getFromQueryValue([{name: 'attr0', type: "int", maxValue: '2'}])).toEqual('- 2')

    it "reads range values with no maximum into strings ending with space-dash", ->
      expect(getFromQueryValue([{name: 'attr0', type: "int", minValue: '1'}])).toEqual('1 -')

  describe "#_errorFor", ->
    getErrorForAttrs = (attrs, type, begin, end) ->
      def = {type: type}
      def.begin = begin if begin
      def.end = end if end
      makeAttrs(def)._errorFor(def, attrs)

    fieldValidationSpecs = (fieldName) ->
      getErrorFor = (value, type, begin, end) ->
        attrs = {}
        attrs[fieldName] = value
        getErrorForAttrs(attrs, type, begin, end)

      it "produces an error for invalid integers", ->
        expect(getErrorFor('123asdf', 'INT')).toEqual('Invalid integer: 123asdf')

      it "produces no error for valid integers", ->
        expect(getErrorFor('123', 'INT')).toEqual(null)

      it "produces an error for invalid floats", ->
        expect(getErrorFor('123asdf', 'FLOAT')).toEqual('Invalid float: 123asdf')

      it "produces no error for valid floats", ->
        expect(getErrorFor('123.4', 'FLOAT')).toEqual(null)

      it "produces an error for invalid dates", ->
        expect(getErrorFor('123asdf', 'DATE')).toEqual('Invalid date: 123asdf')

      it "produces no error for valid dates", ->
        expect(getErrorFor('2014-01-01', 'DATE')).toEqual(null)

      it "produces an error for invalid times", ->
        expect(getErrorFor('123asdf', 'TIME')).toEqual('Invalid time: 123asdf')

      it "produces no error for valid times", ->
        expect(getErrorFor('00:00:00', 'TIME')).toEqual(null)

      it "produces an error for invalid date/times", ->
        expect(getErrorFor('123asdf', 'DATETIME')).toEqual('Invalid date/time: 123asdf')

      it "produces no error for valid date/times", ->
        expect(getErrorFor('2014-01-01T00:00:00', 'DATETIME')).toEqual(null)

      it "produces an error when values are below the allowable minimum", ->
        expect(getErrorFor('0', 'INT', 1)).toEqual('Values must be greater than 1')

      it "produces no error when values are at the allowable minimum", ->
        expect(getErrorFor('1', 'INT', 1)).toEqual(null)

      it "produces no error when values are above the allowable minimum", ->
        expect(getErrorFor('2', 'INT', 1)).toEqual(null)

      it "produces an error when values are above the allowable maximum", ->
        expect(getErrorFor('2', 'INT', null, 1)).toEqual('Values must be less than 1')

      it "produces no error when values are at the allowable maximum", ->
        expect(getErrorFor('1', 'INT', null, 1)).toEqual(null)

      it "produces no error when values are below the allowable maximum", ->
        expect(getErrorFor('0', 'INT', null, 1)).toEqual(null)

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
