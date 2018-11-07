require 'spec_helper'

describe 'Viewing Full Facets Modal' do
  before :all do
    Capybara.reset_sessions!

    load_page :search, facets: true, env: :uat

    @search_page_collection_count = collection_results_header_value.text.to_i
  end

  context 'when expanding a facet category with more than 50 facets available' do
    before :all do
      find('h3.panel-title', text: 'Platforms').click
    end

    it 'displays messaging related to the top 50 facets' do
      within(:css, '.platforms') do
        expect(page).to have_content('Showing Top 50 Platforms')
      end
    end

    it 'displays a link to view all facets' do
      within(:css, '.platforms') do
        expect(page).to have_link('View All')
      end
    end

    context 'when clicking the view all link' do
      before :all do
        within(:css, '.platforms') do
          click_link 'View All'
          wait_for_xhr
        end
      end

      it 'displays the full facet list modal' do
        within '.modal-header' do
          expect(page).to have_content('Filter collections by Platforms')
        end
      end

      it 'displays the same collection count as the search page' do
        within '.modal-footer-status span' do
          expect(page.text.to_i).to eq(@search_page_collection_count)
        end
      end
    end
  end
end
