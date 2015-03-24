require 'spec_helper'

describe 'Map Zooming', reset: false do
  before :all do
    page.driver.resize_window(1680, 1050) # Default capybara window size
    Capybara.reset_sessions!
    visit '/search'
  end

  after :all do
    page.driver.resize_window(1280, 1024)
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
        expect(page).to have_map_center(0, 0, 2)
      end

      it 'zooms to the center of the visible map' do
        expect(page).to have_map_center(0, 30, 3)
      end
    end

    context 'and the overlay is hidden' do
      before :all do
        within '.master-overlay-main' do
          find('.master-overlay-close').click
        end
        expect(page).to have_css(".master-overlay.is-hidden")

        find('.leaflet-control-zoom-in').click
        wait_for_xhr
      end

      after :all do
        find('.leaflet-control-zoom-out').click
        find('.master-overlay-show').click
        expect(page).to have_no_css(".master-overlay.is-hidden")
        wait_for_xhr
        expect(page).to have_map_center(0, 0, 2)
      end

      it 'zooms to the center of the visible map' do
        expect(page).to have_map_center(0, 0, 3)
      end
    end
  end

  context 'when using the zoom home button' do
    context 'with spatial bounds' do
      before :all do
        script = "$('#map').data('map').map.fitBounds([{lat: -40, lng:0}, {lat: -20, lng: 0}]);"
        page.execute_script(script)

        create_bounding_box(0, 0, 20, 20)

        find('.leaflet-control-zoom-home').click
      end

      after :all do
        click_on 'Clear Filters'
        script = "$('#map').data('map').map.setView([0, 0], 2);"
        page.execute_script(script)
      end

      it "centers the map over the spatial area" do
        expect(page).to have_map_center(10, -5, 4)
      end
    end

    context 'without spatial bounds' do
      before :all do
        script = "$('#map').data('map').map.fitBounds([{lat: -40, lng:-10}, {lat: -20, lng: -10}]);"
        page.execute_script(script)

        find('.leaflet-control-zoom-home').click
      end

      after :all do
        script = "$('#map').data('map').map.setView([0, 0], 2);"
        page.execute_script(script)
      end

      it "centers the map at (0,0)" do
        expect(page).to have_map_center(0, 0, 2)
      end
    end
  end
end
