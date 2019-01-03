require 'rails_helper'

describe 'Limited Collections' do
  extend Helpers::CollectionHelpers

  context 'when the number of granules exceeds the collection limit (ASTER for example) in a project' do
    before :all do
      load_page :search, project: 'C14758250-LPDAAC_ECS', authenticate: 'edsc'
      find('div[class="toolbar-secondary"]').click_link 'My Project'
      wait_for_xhr

      collection_card = find('.project-list-item', match: :first)
      collection_card.find('.project-list-item-action-edit-options').click
      wait_for_xhr

      click_on 'Edit Delivery Method'
    end

    it 'displays a warning to the user' do
      expect(page).to have_content('This particular data product requires additional processing. Due to the current demand, the turnaround time for producing these products has increased. As a result, orders are limited to 2000 granules per order. To improve the efficiency of the additional processing, all orders up to 2000 granules will be divided into separate requests of 100 granules each with a unique download link for each set of 100 (or less) granules. ')
    end
  end

  context 'when the number of granules exceeds the collection limit (ASTER for example) on granule list page' do
    before :all do
      load_page :search, q: 'C14758250-LPDAAC_ECS', close_banner: true
    end

    hook_granule_results('ASTER L1A Reconstructed Unprocessed Instrument Data V003')

    it 'disables the retrieve button' do
      expect(page).to have_css('button.button-disabled')
    end

    it 'displays tooltip on mouseover' do
      page.evaluate_script "$('.button-disabled').trigger('mouseover')"
      expect(page).to have_content('Due to significant processing times, orders for this collection are limited to 2000 granules. Please narrow your search before downloading. Contact the data provider with questions. You can find contact information by clicking on the information icon.')
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
