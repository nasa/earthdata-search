# EDSC-24: As a user, I want to search for datasets by 2D coordinates so that I
#          may limit my results to my area of interest

require "spec_helper"

describe "Grid coordinate search", reset: false do
  extend Helpers::DatasetHelpers

  before :all do
    load_page :search
  end

  context 'before selecting the grid spatial type' do
    it 'shows no grid input fields' do
      expect(page).to have_no_field('Grid Coordinates')
    end
  end

  context 'selecting the grid spatial type' do
    before(:all) { choose_tool_from_site_toolbar('Grid') }
    after(:all) { click_on 'Clear Filters' }

    it 'shows grid input fields' do
      expect(page).to have_field('Grid Coordinates')
    end


    context 'selecting a coordinate system' do
      before(:all) { select 'WRS-1 (Landsat 1-3)', from: 'Grid Coordinates' }
      after(:all) { select 'Coordinate System...', from: 'Grid Coordinates' }

      it 'filters datasets to those which use that coordinate system' do
        expect(first_dataset_result).to have_text('Landsat')
      end

      context 'and choosing a different spatial type' do
        before(:all) { choose_tool_from_site_toolbar('Point') }
        after(:all) { choose_tool_from_site_toolbar('Grid') }

        it 'keeps the coordinate system input visible' do
          expect(page).to have_field('Grid Coordinates')
        end

        context 'clearing the selected name' do
          before(:all) { select 'Coordinate System...', from: 'Grid Coordinates' }
          after(:all) do
            choose_tool_from_site_toolbar('Grid')
            select 'WRS-1 (Landsat 1-3)', from: 'Grid Coordinates'
            choose_tool_from_site_toolbar('Point')
          end

          it 'hides the grid input fields' do
            expect(page).to have_no_field('Grid Coordinates')
          end
        end
      end

      context 'entering valid tile numbers and viewing granule results' do
        hook_granule_results

        before(:all) do
          fill_in 'map-grid-coordinates', with: '111,111'
          within('.map-grid-search') {click_on 'Set'}
        end

        after(:all) do
          fill_in 'map-grid-coordinates', with: ' '
          within('.map-grid-search') {click_on 'Set'}
        end

        it 'filters granules to those matching the given tile' do
          expect(first_granule_list_item).to have_text('111111')
        end
      end

      context 'entering tile numbers which are non-numeric' do
        before(:all) do
          fill_in 'map-grid-coordinates', with: '111,111a'
          within('.map-grid-search') {click_on 'Set'}
        end
        after(:all) do
          fill_in 'map-grid-coordinates', with: ' '
          within('.map-grid-search') {click_on 'Set'}
        end

        it 'produces an error message' do
          expect(page).to have_text('Invalid coordinate: 111a')
        end
      end

      context 'entering tile numbers with incorrect separators' do
        before(:all) do
          fill_in 'map-grid-coordinates', with: '111:111'
          within('.map-grid-search') {click_on 'Set'}
        end
        after(:all) do
          fill_in 'map-grid-coordinates', with: ' '
          within('.map-grid-search') {click_on 'Set'}
        end

        it 'produces an error message' do
          expect(page).to have_text('Coordinate must be two comma-separated numbers: 111:111')
        end
      end

      context 'entering tile numbers with the wrong number of coordinates' do
        before(:all) do
          fill_in 'map-grid-coordinates', with: '111,111 222'
          within('.map-grid-search') {click_on 'Set'}
        end
        after(:all) do
          fill_in 'map-grid-coordinates', with: ' '
          within('.map-grid-search') {click_on 'Set'}
        end

        it 'produces an error message' do
          expect(page).to have_text('Coordinate must be two comma-separated numbers: 222')
        end
      end

      context 'entering range values out of order' do
        before(:all) do
          fill_in 'map-grid-coordinates', with: '112-111,111'
          within('.map-grid-search') {click_on 'Set'}
        end
        after(:all) do
          fill_in 'map-grid-coordinates', with: ' '
          within('.map-grid-search') {click_on 'Set'}
        end

        it 'produces an error message' do
          expect(page).to have_text('Range minimum is greater than its maximum: 112-111')
        end
      end
    end

    context 'and clearing search filters' do
      before(:all) { click_on 'Clear Filters' }
      after(:all) { choose_tool_from_site_toolbar('Grid') }

      it 'hides the grid input fields' do
        expect(page).to have_no_field('Grid Coordinates')
      end
    end
  end
end
