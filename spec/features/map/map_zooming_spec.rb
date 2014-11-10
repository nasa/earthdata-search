require 'spec_helper'

describe 'Map Zooming', reset: false do
  before :all do
    Capybara.reset_sessions!
    visit '/search'
  end

  # context 'when zooming with the mouse scroll wheel' do
  #   before :all do
  #     # zoom in with mouse
  #     script = '''
  #       # couldn't find anything that worked here
  #     '''
  #     page.evaluate_script script
  #   end
  #
  #   after :all do
  #     # zoom out with mouse
  #     expect(page).to have_query_string('m=0!0!2!1')
  #   end
  #
  #   it 'zooms to the mouse location' do
  #     expect(page).to have_query_string('m=15!15!3!1')
  #   end
  # end

  context 'when zooming with the zoom buttons' do
    context 'and the overlay is visible' do
      before :all do
        find('.leaflet-control-zoom-in').click
        wait_for_xhr
      end

      after :all do
        find('.leaflet-control-zoom-out').click
        wait_for_xhr
        expect(page).to have_map_center(0,0)
      end

      it 'zooms to the center of the visible map' do
        expect(page).to have_map_center(0,30)
      end
    end

    context 'and the overlay is hidden' do
      before :all do
        within '.master-overlay-main' do
          find('.master-overlay-close').click
        end

        find('.leaflet-control-zoom-in').click
        wait_for_xhr
      end

      after :all do
        find('.leaflet-control-zoom-out').click
        find('.master-overlay-show').click
        wait_for_xhr
        expect(page).to have_map_center(0,0)
      end

      it 'zooms to the center of the visible map' do
        expect(page).to have_map_center(0,0)
      end
    end
  end
end
