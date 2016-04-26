
describe "query", ->
  param = $.param
  ns = window.edsc.models.data.query

  describe "CollectionQuery", ->
    beforeEach ->
      @query = new ns.CollectionQuery()

    it "has a page size of 20 by default", ->
      expect(param(@query.params())).toEqual("page_size=20")

    describe "applied temporal", ->
      it "serializes start dates", ->
        params = {temporal: '2011-07-01T00:00:00.000Z,', page_size: 20}
        @query.params(params)
        expect(param(@query.params())).toEqual(param(params))

      it "serializes end dates", ->
        params = {temporal: ',2011-07-01T00:00:00.000Z', page_size: 20}
        @query.params(params)
        expect(param(@query.params())).toEqual(param(params))

      it "serializes date ranges", ->
        params = {temporal: '2011-07-01T00:00:00.000Z,2011-07-03T00:00:00.000Z', page_size: 20}
        @query.params(params)
        expect(param(@query.params())).toEqual(param(params))

      it "serializes recurring dates", ->
        params = {temporal: '2011-07-01T00:00:00.000Z,2014-07-03T00:00:00.000Z,182,184', page_size: 20}
        @query.params(params)
        expect(param(@query.params())).toEqual(param(params))

    describe 'spatial', ->
      it 'serializes polygons', ->
        params = {polygon: '1,2,3,4,5,6,1,2', page_size: 20}
        @query.params(params)
        expect(param(@query.params())).toEqual(param(params))

      it 'serializes points', ->
        params = {point: '1,2', page_size: 20}
        @query.params(params)
        expect(param(@query.params())).toEqual(param(params))

      it 'serializes lines', ->
        params = {point: '1,2,3,4', page_size: 20}
        @query.params(params)
        expect(param(@query.params())).toEqual(param(params))

      it 'serializes bounding boxes', ->
        params = {point: '1,2,3,4', page_size: 20}
        @query.params(params)
        expect(param(@query.params())).toEqual(param(params))

    it "serializes collection facets", ->
      # This is intentionally a little different.  We don't deserialize facets
      params = {campaign: ['campaign1', 'campaign2'], sensor: ['sensor1'], page_size: 20}
      @query.facets.push(param: 'campaign', term: 'campaign1')
      @query.facets.push(param: 'campaign', term: 'campaign2')
      @query.facets.push(param: 'sensor', term: 'sensor1')
      expect(param(@query.params())).toEqual(param(params))

    it "does not deserialize collection facets", ->
      params = {campaign: ['campaign1', 'campaign2'], sensor: ['sensor1'], page_size: 20}
      expect(param(@query.params())).toEqual("page_size=20")

    it 'serializes keywords', ->
      params = {page_size: 20, free_text: "modis over Texas"}
      @query.params(params)
      expect(param(@query.params())).toEqual(param(params))

    it 'removes placenames from keywords before serialization', ->
      params = {page_size: 20, free_text: "modis"}
      @query.keywords('modis over Texas')
      @query.placename(' over Texas')
      expect(param(@query.params())).toEqual(param(params))

    it 'sets all values to their defaults when clearFilters is called', ->
      params =
        temporal: '2011-07-01T00:00:00.000Z,2014-07-03T00:00:00.000Z,182,184'
        point: '1,2'
        line: '1,2,3,4'
        polygon: '1,2,3,4,5,6,1,2'
        bounding_box: '1,2,3,4'
        free_text: 'modis'
        page_size: 20

      defaults =
        page_size: 20

      @query.params(params)
      @query.facets.push(param: 'campaign', term: 'campaign1')

      @query.clearFilters()
      expect(param(@query.params())).toEqual(param(defaults))

  describe "GranuleQuery", ->
    beforeEach ->
      @ds_id = 'my_item_id'
      @parent = new ns.CollectionQuery()
      @query = new ns.GranuleQuery(@ds_id, @parent, null, '')

    it 'serializes catalog item id, sort key, and page size by default', ->
      expect(param(@query.params())).toEqual("echo_collection_id=#{@ds_id}&sort_key%5B%5D=-start_date&page_size=20")

    describe 'inherited parameters', ->
      it "inherits the parent query's temporal condition", ->
        parentParams = {temporal: '2011-07-01T00:00:00.000Z,2014-07-03T00:00:00.000Z,182,184'}
        @parent.params(parentParams)
        params =
          temporal: '2011-07-01T00:00:00.000Z,2014-07-03T00:00:00.000Z,182,184',
          echo_collection_id: @ds_id,
          sort_key: ['-start_date'],
          page_size: 20
        expect(param(@query.params())).toEqual(param(params))

      it "overrides the parent query's temporal condition", ->
        parentParams = {temporal: '2011-07-01T00:00:00.000Z,2014-07-03T00:00:00.000Z,182,184'}
        @parent.params(parentParams)
        params =
          temporal: '2012-07-01T00:00:00.000Z,2014-07-03T00:00:00.000Z,182,184'
          echo_collection_id: @ds_id
          sort_key: ['-start_date']
          page_size: 20
        @query.params(params)
        expect(param(@query.params())).toEqual(param(params))

      it "inherits the parent query's spatial condition", ->
        parentParams = {point: '1,2'}
        @parent.params(parentParams)
        params =
          point: '1,2'
          echo_collection_id: @ds_id
          sort_key: ['-start_date']
          page_size: 20
        expect(param(@query.params())).toEqual(param(params))

      it 'does not inherit keywords or facets', ->
        parentParams = {sensor: ['sensor1'], free_text: 'modis'}
        @parent.params(parentParams)
        params =
          echo_collection_id: @ds_id
          sort_key: ['-start_date']
          page_size: 20

    it 'serializes day/night flag', ->
      params =
        echo_collection_id: @ds_id
        sort_key: ['-start_date']
        day_night_flag: 'DAY'
        page_size: 20
      @query.params(params)
      expect(param(@query.params())).toEqual(param(params))

    describe 'browse only flag', ->
      it 'serializes browse only flag when set to true', ->
        @query.browseOnly('true')
        params =
          echo_collection_id: @ds_id
          sort_key: ['-start_date']
          browse_only: true
          page_size: 20
        expect(param(@query.params())).toEqual(param(params))

      it 'does not serialize browse only flag when set to false', ->
        @query.browseOnly('false')
        params =
          echo_collection_id: @ds_id
          sort_key: ['-start_date']
          page_size: 20
        expect(param(@query.params())).toEqual(param(params))

    describe 'online only flag', ->
      it 'serializes online only flag when set to true', ->
        @query.onlineOnly('true')
        params =
          echo_collection_id: @ds_id
          sort_key: ['-start_date']
          online_only: true
          page_size: 20
        expect(param(@query.params())).toEqual(param(params))

      it 'does not serialize online only flag when set to false', ->
        @query.onlineOnly('false')
        params =
          echo_collection_id: @ds_id
          sort_key: ['-start_date']
          page_size: 20
        expect(param(@query.params())).toEqual(param(params))

    it 'serializes cloud cover', ->
      params =
        echo_collection_id: @ds_id
        sort_key: ['-start_date']
        cloud_cover: {min: 10, max: 20}
        page_size: 20
      @query.params(params)
      expect(param(@query.params())).toEqual(param(params))

    it 'serializes readable granule names', ->
      params =
        echo_collection_id: @ds_id
        sort_key: ['-start_date']
        readable_granule_name: ['1', '2']
        page_size: 20
      @query.params(params)
      expect(param(@query.params())).toEqual(param(params))

    it 'sets all values to their defaults when clearFilters is called', ->
      params =
        echo_collection_id: @ds_id
        sort_key: ['-start_date']
        temporal: '2011-07-01T00:00:00.000Z,2014-07-03T00:00:00.000Z,182,184'
        day_night_flag: 'DAY'
        browse_only: true
        online_only: true
        cloud_cover: {min: 10, max: 20}
        producer_granule_id: ['1', '2']
        page_size: 20

      defaults =
        echo_collection_id: @ds_id
        sort_key: ['-start_date']
        page_size: 20

      @query.params(params)
      @query.clearFilters()
      expect(param(@query.params())).toEqual(param(defaults))
