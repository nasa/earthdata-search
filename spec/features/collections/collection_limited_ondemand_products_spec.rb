require "spec_helper"

describe "Limited Collections", reset: false do
  extend Helpers::CollectionHelpers


  before :all do
    Capybara.reset_sessions!
    load_page :search, q: 'C14758250-LPDAAC_ECS', close_banner: true
  end

  context 'when the number of granules exceeds the collection limit (ASTER for example) in a project' do
    before :all do
      target_collection_result('ASTER L1A Reconstructed Unprocessed Instrument Data V003').click_link 'Add collection to the current project'
      find('div[class="toolbar-secondary"]').click_link 'My Project'
    end

    after :all do
      first_project_collection.click_link 'Remove collection from the current project'
      click_link 'Back to Collection Search'
    end

    it 'disables the retrieve button' do
      expect(page).to have_css('button.button-disabled')
    end

    it 'displays tooltip on mouseover' do
      page.evaluate_script "$('.button-disabled').trigger('mouseover')"
      expect(page).to have_content('Due to significant processing times, orders for this collection are limited to 100 granules. Please narrow your search before downloading. Contact lpdaac@usgs.gov with questions.')
    end
  end

  context 'when the number of granules exceeds the collection limit (ASTER for example) on granule list page' do
    hook_granule_results('ASTER L1A Reconstructed Unprocessed Instrument Data V003')

    it 'disables the retrieve button' do
      expect(page).to have_css('button.button-disabled')
    end

    it 'displays tooltip on mouseover' do
      page.evaluate_script "$('.button-disabled').trigger('mouseover')"
      expect(page).to have_content('Due to significant processing times, orders for this collection are limited to 2000 granules. Please narrow your search before downloading. Contact lpdaac@usgs.gov with questions.')
    end

    context 'when the results are filtered down within 100 granules' do
      before :all do
        temporal_start_date = DateTime.new(2016, 8, 15, 22, 55, 0, '+0')
        temporal_stop_date = DateTime.new(2016, 8, 15, 23, 55, 0, '+0')
        set_temporal(temporal_start_date, temporal_stop_date)
      end

      after :all do
        unset_temporal
      end

      it 'enables the retrieve button' do
        expect(page).to have_css('.retrieve')
      end
    end
  end
end
