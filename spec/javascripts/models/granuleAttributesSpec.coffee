
describe "GranuleAttributes", ->
  GranuleAttributes = window.edsc.models.data.GranuleAttributes

  describe '#isValid', ->
    it 'returns false if any field is invalid'
    it 'returns true if all fields are valid'
    it 'returns true there are no defined fields'

  describe "#queryCondition", ->
    describe "reading", ->
      it "reads nothing when no condition is set"
      it "reads a single condition when a condition is set"
      it "reads multiple conditions when multiple conditions are set"

    describe "writing", ->
      it "writes nothing when no condition is present in the query"
      it "writes a single condition when a condition is present in the query"
      it "writes multiple conditions when multiple conditions are present in the query"

  describe '#_toQuery', ->
    it "ignores empty strings"
    it "ignores blank strings"
    it "ignores null strings"
    it "parses values separated by space-dash-space into ranges"
    it "parses values beginning with dash-space into ranges with no minValue"
    it "parses values ending with space-dash into ranges with no maxValue"
    it "parses negative number values without creating inappropriate ranges"
    it "parses negative number values contained in ranges"
    it "normalizes dates to ISO format"

  describe '#_fromQuery', ->
    it "reads range values into space-dash-space separated strings"
    it "reads range values with no minimum into strings beginning with dash-space"
    it "reads range values with no maximum into strings ending with space-dash"

  describe "#_errorFor", ->
    fieldValidationSpecs = (fieldName) ->
      it "produces an error for invalid integers"
      it "produces no error for invalid integers"
      it "produces an error for invalid floats"
      it "produces no error for invalid floats"
      it "produces an error for invalid dates"
      it "produces no error for invalid dates"
      it "produces an error for invalid times"
      it "produces no error for invalid times"
      it "produces an error for invalid date/times"
      it "produces no error for invalid date/times"

      it "produces an error when values are below the allowable minimum"
      it "produces no error when values are at the allowable minimum"
      it "produces no error when values are above the allowable minimum"

      it "produces an error when values are above the allowable maximum"
      it "produces no error when values are at the allowable maximum"
      it "produces no error when values are below the allowable maximum"

    describe "for value fields", -> fieldValidationSpecs('value')
    describe "for minValue fields", -> fieldValidationSpecs('minValue')
    describe "for maxValue fields", -> fieldValidationSpecs('maxValue')

    describe "when both minValue and maxValue are supplied", ->
      it "validates that integer minValues are below the supplied maxValue"
      it "validates that float minValues are below the supplied maxValue"
      it "validates that date minValues are below the supplied maxValue"
