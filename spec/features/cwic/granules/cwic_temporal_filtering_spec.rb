require 'spec_helper'

describe 'CWIC-enabled granule results' do
  extend Helpers::CollectionHelpers

  before :all do
    load_page :search, focus: 'C1220566654-USGS_LTA'
  end

  context 'setting a non-recurring temporal condition' do
    before(:all) do
      manually_set_temporal('2013-12-01 00:00:00', '2013-12-01 23:59:59')
    end

    it 'displays the filter on screen' do
      expect(page).to have_css('#temporal-query')
    end

    it 'filter contains the correct start date' do
      within '#temporal-query' do
        expect(page).to have_content('Start: 2013-12-01 00:00:00')
      end
    end

    it 'filter contains the correct stop date' do
      within '#temporal-query' do
        expect(page).to have_content('Stop: 2013-12-01 23:59:59')
      end
    end

    context 'and removing the temporal condition' do
      before(:all) { manually_unset_temporal }

      it 'updates the results list with the new filter' do
        expect(page).not_to have_css('#temporal-query')
      end
    end
  end

  context 'setting a recurring temporal condition' do
    before(:all) do
      manually_set_temporal('12-01 00:00:00', '12-01 23:59:59', [2013, 2014])
    end

    it 'displays the filter on screen' do
      expect(page).to have_css('#temporal-query')
    end

    it 'filter contains the correct start date' do
      within '#temporal-query' do
        expect(page).to have_content('Start: 12-01 00:00:00')
      end
    end

    it 'filter contains the correct stop date' do
      within '#temporal-query' do
        expect(page).to have_content('Stop: 12-01 23:59:59')
      end
    end

    it 'filter contains the correct range' do
      within '#temporal-query' do
        expect(page).to have_content('Range: 2013 - 2014')
      end
    end

    context 'and removing the temporal condition' do
      before(:all) { manually_unset_temporal }

      it 'updates the results list with the new filter' do
        expect(page).not_to have_css('#temporal-query')
      end
    end
  end
end
