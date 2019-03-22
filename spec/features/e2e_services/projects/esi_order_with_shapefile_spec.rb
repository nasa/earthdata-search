require 'rails_helper'
require 'json'

describe 'ESI Order with Shapefile' do
  before :all do
    # Don't process retrievals
    Delayed::Worker.delay_jobs = true
  end

  after :all do
    Delayed::Worker.delay_jobs = false
  end

  context 'when submitting an order with a shapefile' do
    before :all do
      # create shapefile
      json = JSON.parse(File.read('doc/example-data/shapefiles/simple.geojson'))
      @shapefile = Shapefile.new(file: json, file_hash: Shapefile.generate_hash(json))

      load_page :projects_page, project: ['C1200341690-EDF_DEV02'], shapefile: @shapefile.to_param, authenticate: 'edsc', env: :sit

      choose('Customize')
      check 'Use Shapefile from Search'
      find('.button-download-data').click
      wait_for_xhr
    end

    it 'saves the shapefile into the Retrieval' do
      retrieval = Retrieval.last
      expect(retrieval.source).to have_text("sf=#{@shapefile.to_param}")
    end
  end
end
