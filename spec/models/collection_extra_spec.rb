require 'spec_helper'

describe CollectionExtra do
  context "result decoration" do
    it "adds thumbnail URLs to results" do
      granule = 'browseable_granule'
      collection_hash = {}
      extra = CollectionExtra.new(browseable_granule: granule)
      result = extra.decorate(collection_hash)
      expect(result[:browseable_granule]).to eq(granule)
    end

    it "adds a flag indicating whether a collection has granules to the results" do
      collection_hash = {}
      extra = CollectionExtra.new(has_granules: true)
      result = extra.decorate(collection_hash)
      expect(result[:has_granules]).to eq(true)
    end

    it "adds additional attribute definitions" do
      collection_hash = {}
      attrs = {'attributes' => [{'name' => 'name', 'description' => 'desc', 'data_type' => 'STRING'}]}
      extra = CollectionExtra.new(searchable_attributes: attrs)
      result = extra.decorate(collection_hash)
      expected = [{'name' => 'name', 'description' => 'desc', 'type' => 'STRING', 'help' => 'String value'}]
      expect(result[:searchable_attributes]).to eq(expected)
    end

    it "adds orbit information" do
      collection_hash = {}
      extra = CollectionExtra.new(orbit: {'orbit_param' => 'value'})
      result = extra.decorate(collection_hash)
      expect(result[:orbit]).to eq({'orbit_param' => 'value'})
    end

    context "CWIC tag conversion" do

      it "adds datasource and renderer tags to CWIC-tagged collections" do
        collection_hash = {tags: {'org.ceos.wgiss.cwic.granules.prod' => {}}}
        extra = CollectionExtra.new()
        result = extra.decorate(collection_hash)
        expect(result[:tags]).to eq({'org.ceos.wgiss.cwic.granules.prod' => {},
                                     'edsc.datasource' => {'data' => 'cwic'},
                                     'edsc.renderers' => {'data' => ['cwic']}})
      end

      it "does not overwrite already-specified datasource and renderers" do
        collection_hash = {tags: {'org.ceos.wgiss.cwic.granules.prod' => {},
                                  'edsc.datasource' => {'data' => 'not_cwic'},
                                  'edsc.renderers' => {'data' => ['not_cwic']}}}
        expected = collection_hash[:tags].dup
        extra = CollectionExtra.new()
        result = extra.decorate(collection_hash)
        expect(result[:tags]).to eq(expected)
      end

      it "does not add datasource and renderer tags to non-CWIC-tagged collections" do
        collection_hash = {tags: {'org.ceos.not-cwic' => {}}}
        expected = collection_hash[:tags].dup
        extra = CollectionExtra.new()
        result = extra.decorate(collection_hash)
        expect(result[:tags]).to eq(expected)
      end
    end
  end

  context "#clean_attributes" do
    def clean_attributes(*options)
      defaults = {'name' => 'name1', 'description' => 'desc1', 'data_type' => 'STRING'}
      persisted = options.map { |option| defaults.merge(option) }
      CollectionExtra.new(searchable_attributes: {'attributes' => persisted}).clean_attributes.first
    end

    context 'description removal' do
      it "removes descriptions which are the same as name" do
        clean = clean_attributes('name' => 'somename', 'description' => 'somename')
        expect(clean['description']).to be_nil
      end

      it "removes descriptions which contain only 'The <name> for this collection'" do
        clean = clean_attributes('name' => 'somename', 'description' => 'The somename for this collection')
        expect(clean['description']).to be_nil
      end

      it "removes descriptions which contain only 'The <name> attribute for this granule'" do
        clean = clean_attributes('name' => 'somename', 'description' => 'The somename attribute for this granule')
        expect(clean['description']).to be_nil
      end

      it "removes descriptions which are set to 'None'" do
        clean = clean_attributes('description' => 'None')
        expect(clean['description']).to be_nil
      end

      it "does not move useful descriptions" do
        clean = clean_attributes('name' => 'somename', 'description' => 'Very useful description of somename collection')
        expect(clean['description']).to eq('Very useful description of somename collection')
      end
    end

    context 'string type cleanup' do
      it 'changes the un-queryable "DATE_STRING" into the queryable "STRING"' do
        clean = clean_attributes('data_type' => 'DATE_STRING')
        expect(clean['type']).to eq('STRING')
      end

      it 'changes the un-queryable "TIME_STRING" into the queryable "STRING"' do
        clean = clean_attributes('data_type' => 'TIME_STRING')
        expect(clean['type']).to eq('STRING')
      end

      it 'changes the un-queryable "DATETIME_STRING" into the queryable "STRING"' do
        clean = clean_attributes('data_type' => 'DATETIME_STRING')
        expect(clean['type']).to eq('STRING')
      end

      it 'does not change non-string types' do
        clean = clean_attributes('data_type' => 'DATETIME')
        expect(clean['type']).to eq('DATETIME')
      end
    end

    context "field shortening" do
      it 'shortens "data_type" to "type"' do
        clean = clean_attributes('data_type' => 'some value')
        expect(clean['type']).to eq('some value')
      end

      it 'shortens "parameter_units_of_measure" to "unit"' do
        clean = clean_attributes('parameter_units_of_measure' => 'some value')
        expect(clean['unit']).to eq('some value')
      end

      it 'shortens "parameter_range_begin" to "begin"' do
        clean = clean_attributes('parameter_range_begin' => 'some value')
        expect(clean['begin']).to eq('some value')
      end

      it 'shortens "parameter_range_end" to "end"' do
        clean = clean_attributes('parameter_range_end' => 'some value')
        expect(clean['end']).to eq('some value')
      end
    end

    context 'help generation' do
      it "includes a human-readable version of INT types in the description" do
        clean = clean_attributes('data_type' => 'INT')
        expect(clean['help']).to start_with('Integer')
      end

      it "includes a human-readable version of FLOAT types in the description" do
        clean = clean_attributes('data_type' => 'FLOAT')
        expect(clean['help']).to start_with('Float')
      end

      it "includes a human-readable version of DATETIME types in the description" do
        clean = clean_attributes('data_type' => 'DATETIME')
        expect(clean['help']).to start_with('Date/Time')
      end

      it "includes a human-readable version of TIME types in the description" do
        clean = clean_attributes('data_type' => 'TIME')
        expect(clean['help']).to start_with('Time')
      end

      it "includes a human-readable version of DATE types in the description" do
        clean = clean_attributes('data_type' => 'DATE')
        expect(clean['help']).to start_with('Date')
      end

      it "includes a human-readable version of STRING types in the description" do
        clean = clean_attributes('data_type' => 'STRING')
        expect(clean['help']).to start_with('String value')
      end

      it "includes the raw type name in the description when the type is not recognized" do
        clean = clean_attributes('data_type' => 'UNRECOGNIZED')
        expect(clean['help']).to start_with('UNRECOGNIZED')
      end

      context 'for attributes with units' do
        let(:clean) { clean_attributes('parameter_units_of_measure' => 'Mega-Furlongs') }

        it "includes the unit in the help text" do
          expect(clean['help']).to include('Mega-Furlongs')
        end
      end

      context 'for attributes without units' do
        let(:clean) { clean_attributes({}) }

        it "includes no unit in the help text" do
          expect(clean['help']).to eq('String value')
        end
      end

      context 'for attributes with minimum values and no maximum' do
        let(:clean) { clean_attributes('data_type' => 'INT', 'parameter_range_begin' => '10') }

        it "displays text about the minimum value" do
          expect(clean['help']).to include('minimum: 10')
        end

        it "displays no text about the maximum value" do
          expect(clean['help']).not_to include('maximum:')
        end

        it "displays no text about range of values" do
          expect(clean['help']).to_not include('from')
        end
      end

      context 'for attributes with maximum values and no minimum' do
        let(:clean) { clean_attributes('data_type' => 'INT', 'parameter_range_end' => '50') }

        it "displays no text about the minimum value" do
          expect(clean['help']).not_to include('minimum:')
        end

        it "displays text about the maximum value" do
          expect(clean['help']).to include('maximum: 50')
        end

        it "displays no text about range of values" do
          expect(clean['help']).to_not include('from')
        end
      end

      context 'for attributes with both maximum and minimum values' do
        let(:clean) { clean_attributes('data_type' => 'INT', 'parameter_range_begin' => '10', 'parameter_range_end' => '50') }

        it "displays no text about the minimum value" do
          expect(clean['help']).not_to include('minimum:')
        end

        it "displays text about the maximum value" do
          expect(clean['help']).not_to include('maximum:')
        end

        it "displays no text about range of values" do
          expect(clean['help']).to include('from 10 to 50')
        end
      end
    end

    context 'for attributes of integer type with range constraints' do
      let(:clean) { clean_attributes('data_type' => 'INT', 'parameter_range_begin' => '10', 'parameter_range_end' => '50') }

      it "transforms the beginning of the range to a number" do
        expect(clean['begin']).to eq(10)
      end

      it "transforms the end of the range to a number" do
        expect(clean['end']).to eq(50)
      end
    end

    context 'for attributes of float type with range constraints' do
      let(:clean) { clean_attributes('data_type' => 'FLOAT', 'parameter_range_begin' => '10', 'parameter_range_end' => '50') }

      it "transforms the beginning of the range to a number" do
        expect(clean['begin']).to eq(10)
      end

      it "transforms the end of the range to a number" do
        expect(clean['end']).to eq(50)
      end
    end

    context 'for attributes of non-numeric type with range constraints' do
      let(:clean) { clean_attributes('data_type' => 'DATE', 'parameter_range_begin' => '2014-01-01', 'parameter_range_end' => '2014-07-01') }

      it "does not transform the beginning of the range" do
        expect(clean['begin']).to eq('2014-01-01')
      end

      it "does not transform the end of the range" do
        expect(clean['end']).to eq('2014-07-01')
      end
    end
  end
end
