require 'spec_helper'

describe 'Spatial and temporal extraction' do
  context 'extracted spatial information' do
    before :all do
      load_page :search
      fill_in 'keywords', with: 'Texas'
      wait_for_xhr
    end

    it 'is set in the query' do
      expect(page.current_url).to have_content('ok=Texas&sb=-106.645646%2C25.837164%2C-93.508039%2C36.500704')
    end

    it 'is set on the map' do
      expect(page).to have_css('.leaflet-overlay-pane path')
      expect(page).to have_spatial_constraint('bounding_box:-106.645646,25.837164:-93.508039,36.500704')
    end
  end

  context 'extracted temporal information' do
    before :all do
      load_page :search

      @all_collections_count = collection_results_header_value.text.to_i
      fill_in 'keywords', with: 'last winter'
      wait_for_xhr
      @last_winter_collections_count = collection_results_header_value.text.to_i
    end

    it 'filters collection results' do
      expect(@all_collections_count).to be > @last_winter_collections_count
    end

    it 'is set in the query' do
      expect(page.current_url).to include('qt=2017-12-01T00%3A00%3A00.000Z%2C2018-03-31T23%3A59%3A59.000Z&ok=last%20winter')
    end
  end

  context 'extracted spatial and temporal information' do
    before :all do
      Capybara.reset_sessions!
      load_page :search
      fill_in 'keywords', with: 'snow cover in Boston last winter'
      wait_for_xhr
    end

    it 'doesn\'t overwrite the search text' do
      expect(find_field('keywords').value).to eql('snow cover in Boston last winter')
    end

    it 'is set in the query and adds q= and ok= query params to the url' do
      expect(page.current_url).to have_content('qt=2017-12-01T00%3A00%3A00.000Z%2C2018-03-31T23%3A59%3A59.000Z&q=snow%20cover&ok=snow%20cover%20in%20Boston%20last%20winter&sb=-71.191155%2C42.22788%2C-70.748802%2C42.40082')
    end

    it 'is set on the map' do
      expect(page).to have_css('.leaflet-overlay-pane path')
      expect(page).to have_spatial_constraint('bounding_box:-71.191155,42.22788:-70.748802,42.40082')
    end
  end

  context 'keyword only search' do
    before :all do
      load_page :search, q: 'C179003030-ORNL_DAAC'
    end

    it 'doesn\'t apply spatial or temporal filters' do
      expect(page.current_url).to match(/q=C179003030-ORNL_DAAC&ok=C179003030-ORNL_DAAC/)
    end
  end
end
