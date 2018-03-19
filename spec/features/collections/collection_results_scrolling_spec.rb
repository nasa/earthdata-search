require 'spec_helper'

describe 'Collection results scrolling', reset: false do
  before :all do
    load_page :search, q: 'AQUARIUS_SAC-D AS'
  end

  context 'when scrolling to load a new page' do
    context 'When scrolling to the bottom of the results list' do
      before do
        page.execute_script "$('#collection-results .master-overlay-content')[0].scrollTop = 10000"
        wait_for_xhr
      end

      it 'loads more results' do
        expect(page).to have_css('#collection-results-list .panel-list-item', count: 40)
      end

      context 'When scrolling until all results have been loaded' do
        before :all do
          page.execute_script "$('#collection-results .master-overlay-content')[0].scrollTop = 20000"
          wait_for_xhr

          page.execute_script "$('#collection-results .master-overlay-content')[0].scrollTop = 30000"
          wait_for_xhr
          
          page.execute_script "$('#collection-results .master-overlay-content')[0].scrollTop = 40000"
          wait_for_xhr
        end

        it 'does not load additional results' do
          expect(page).to have_css('#collection-results-list .panel-list-item', count: 67)
        end

        it 'does not show the loading message' do
          expect(page).to have_no_content('Loading collections...')
        end
      end
    end

    # context 'and updating the query' do
    #   before :all do
    #     fill_in 'keywords', with: 'A'
    #     wait_for_xhr
    #   end

    #   it "scrolls to the top of the list" do
    #     pos = page.evaluate_script "$('#collection-results .master-overlay-content')[0].scrollTop"
    #     expect(pos).to equal 0
    #   end
    # end
  end
end
