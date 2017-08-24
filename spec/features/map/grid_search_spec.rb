require "spec_helper"

describe "Grid coordinate search", reset: false do
  extend Helpers::CollectionHelpers

  before :all do
    load_page :search
  end

  after :all do
    wait_for_xhr
  end

  context 'before selecting the grid spatial type' do
    it 'shows no grid input fields' do
      expect(page).to have_no_field('Grid:')
    end
  end

  context 'selecting the grid spatial type' do
    before(:all) { choose_tool_from_site_toolbar('Grid') }
    after(:all) { click_on 'Clear Filters' }

    it 'shows grid input fields' do
      expect(page).to have_field('Grid:')
    end

    it 'displays all of the potential coordinate systems' do
      find("#map-grid-system").should have_content('CALIPSO')
      find("#map-grid-system").should have_content('MISR')
      find("#map-grid-system").should have_content('MODIS EASE Grid')
      find("#map-grid-system").should have_content('MODIS Sinusoidal')
      find("#map-grid-system").should have_content('WRS-1 (Landsat 1-3)')
      find("#map-grid-system").should have_content('WRS-2 (Landsat 4+)')
      # EDSC-1418: Newly added coordinate systems
      find("#map-grid-system").should have_content('WELD CONUS Tile')
      find("#map-grid-system").should have_content('WELD ALASKA Tile')
    end
    context 'selecting a coordinate system' do
      before :all  do
        select 'WRS-1 (Landsat 1-3)', from: 'map-grid-system'
        wait_for_xhr
      end
      after :all do
        select 'Coordinate System...', from: 'map-grid-system'
        wait_for_xhr
      end

      it 'filters collections to those which use that coordinate system' do
        expect(first_collection_result).to have_text('Landsat')
      end

      context 'and choosing a different spatial type' do
        before(:all) { choose_tool_from_site_toolbar('Point') }
        after(:all) { choose_tool_from_site_toolbar('Grid') }

        it 'keeps the coordinate system input visible' do
          expect(page).to have_field('Grid:')
        end

        context 'clearing the selected name' do
          before :all do
            select 'Coordinate System...', from: 'map-grid-system'
            wait_for_xhr
          end

          after :all  do
            choose_tool_from_site_toolbar('Grid')
            select 'WRS-1 (Landsat 1-3)', from: 'map-grid-system'
            choose_tool_from_site_toolbar('Point')
          end

          it 'hides the grid input fields' do
            expect(page).to have_no_field('Grid:')
          end
        end

        context 'clearing grid search filter (by clicking the "x")' do
          before :all do
            select 'Coordinate System...', from: 'map-grid-system'
            wait_for_xhr
          end

          after :all  do
            choose_tool_from_site_toolbar('Grid')
            select 'WRS-1 (Landsat 1-3)', from: 'map-grid-system'
            choose_tool_from_site_toolbar('Point')
          end

          it 'clears the grid input filter' do
            expect(page).not_to have_query_string('s2n=WRS-1')
          end
        end
      end

      context 'entering valid tile numbers and viewing granule results' do
        hook_granule_results('Landsat 1-5 Multispectral Scanner V1')

        before :all do
          fill_in 'map-grid-coordinates', with: "111,111\t"
        end

        after :all do
          fill_in 'map-grid-coordinates', with: " \t"
        end

        it 'filters granules to those matching the given tile' do
          expect(first_granule_list_item).to have_text('111111')
        end
      end

      context 'entering tile numbers which are non-numeric' do
        before :all do
          fill_in 'map-grid-coordinates', with: "111,111a\t"
        end

        after :all do
          fill_in 'map-grid-coordinates', with: " \t"
        end

        it 'produces an error message' do
          expect(page).to have_text('Invalid coordinate: 111a')
        end
      end

      context 'entering tile numbers with incorrect separators' do
        before :all do
          fill_in 'map-grid-coordinates', with: "111:111\t"
        end

        after :all do
          fill_in 'map-grid-coordinates', with: " \t"
        end

        it 'produces an error message' do
          expect(page).to have_text('Coordinate must be two comma-separated numbers: 111:111')
        end
      end

      context 'entering tile numbers with the wrong number of coordinates' do
        before :all do
          fill_in 'map-grid-coordinates', with: "111,111 222\t"
        end

        after :all do
          fill_in 'map-grid-coordinates', with: " \t"
        end

        it 'produces an error message' do
          expect(page).to have_text('Coordinate must be two comma-separated numbers: 222')
        end
      end
    end

    context 'and clearing grid search filter (by clicking the "x")' do
      before :all do
        page.find('a[title="Remove grid coordinates constraint"]').click
      end

      after :all do
        choose_tool_from_site_toolbar('Grid')
        wait_for_xhr
      end

      it 'hides the grid input fields' do
        expect(page).to have_no_field('Grid:')
      end
    end

    context 'and clearing all search filters' do
      before(:all) { click_on 'Clear Filters' }
      after :all do
        choose_tool_from_site_toolbar('Grid')
        wait_for_xhr
      end

      it 'hides the grid input fields' do
        expect(page).to have_no_field('Grid:')
      end
    end
  end
end
