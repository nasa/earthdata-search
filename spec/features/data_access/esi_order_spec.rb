require 'rails_helper'

describe 'ESI Orders' do
  before :all do
    # Don't process retrievals
    Delayed::Worker.delay_jobs = true
  end

  after :all do
    Delayed::Worker.delay_jobs = false
  end

  context 'when submitting an order with a shapefile' do
    before :all do

      ## load_page :projects_page, project: ['C1200341690-EDF_DEV02'], temporal: ['1970-01-01T00:00:00Z', '2019-03-01T23:59:59Z'], authenticate: 'edsc', env: :sit
      # load_page :search, env: :sit, authenticate: 'edsc', q: 'C1200341690-EDF_DEV02'
      # wait_for_xhr
      # upload_shapefile('doc/example-data/shapefiles/single_shp.shp')
      # wait_for_xhr
      # collection_card = find('.project-list-item', match: :first)
      # collection_card.find('.project-list-item-action-edit-options').click
      # wait_for_xhr
      # click_on 'Edit Delivery Method'
      # choose('Customize & Download')
      # check 'Use Shapefile from Search'
      # find('.button-download-data').click

      # TODO Above not working, no results for collection concept id

      retrieval = Retrieval.last
    end

  end
end
