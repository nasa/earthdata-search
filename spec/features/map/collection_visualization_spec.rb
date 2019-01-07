require 'rails_helper'

describe 'Collection visualizations' do
  extend Helpers::CollectionHelpers

  context 'on collection list page' do
    before do
      load_page :collection_details, focus: 'C179002914-ORNL_DAAC'
    end

    context "when clicking on 'View collection details' button" do
      it 'displays a position marker on the mini map but not the map layer' do
        within '#collection-details' do
          expect(page).to have_css('.leaflet-marker-icon')
        end

        within '#map' do
          expect(page).to have_no_css('.leaflet-marker-icon')
        end
      end
    end
  end
end
