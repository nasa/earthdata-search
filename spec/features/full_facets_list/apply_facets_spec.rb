require 'spec_helper'

describe 'Applying facets from Full Facets List Modal' do
  before :all do
    Capybara.reset_sessions!

    load_page :search, env: :uat, facets: true
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
        end

        wait_for_xhr
      end

      it 'displays the full facet list modal' do
        within '.modal-header' do
          expect(page).to have_content('Filter collections by Platforms')
        end
      end

      context 'when selecting a facet that is not returned in the top 50' do
        before :all do
          desired_facet = find("#all-facets-modal .facets-item[title='ALOS']")

          # Store the number of collections the facet claims
          @desired_facet_count = desired_facet.find(:css, '.facet-item-collection-count').text.to_i

          within '#all-facets-modal' do
            check 'ALOS'
          end

          wait_for_xhr
        end

        context 'when selecting a facet and applying it' do
          before :all do
            within '.modal-footer' do
              click_button 'Apply'
            end

            wait_for_xhr
          end

          it 'applies the selected facet to the search page' do
            wait_for_xhr
            # Ask for the value again to ensure that it has not changed
            current_collection_count = collection_results_header_value.text.to_i

            expect(current_collection_count).to eq(@desired_facet_count)
          end
        end
      end
    end
  end
end
