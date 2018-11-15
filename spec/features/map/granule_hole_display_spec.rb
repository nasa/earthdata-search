require 'spec_helper'

describe 'Granule hole displays', reset: true do
  extend Helpers::CollectionHelpers

  before :each do
    load_page :search, focus: 'C1000000300-NSIDC_ECS'
  end

  context 'for collections whose granules have holes' do
    context 'when selecting a granule' do
      before :each do
        third_granule_list_item.click
      end

      it 'draws footprints that contain holes' do
        expect(page).to have_selector('.leaflet-overlay-pane path', count: 4)
      end
    end

    context 'when mousing over a hole area' do
      before :each do
        map_mousemove('#map', 75, -40)
      end

      it 'does not display a footprint outline' do
        expect(page).to have_no_selector('.leaflet-overlay-pane path')
      end
    end

    context 'when mousing over a granule non-hole area' do
      before :each do
        map_mousemove('#map', 76, -28)
      end

      it 'displays a footprint outline' do
        expect(page).to have_selector('.leaflet-overlay-pane path', count: 2, visible: false)
      end
    end
  end
end
