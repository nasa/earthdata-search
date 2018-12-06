require 'spec_helper'

describe 'When viewing the project page' do
  before :all do
    # This collection is specifically configured for this test on SIT. Any changes can
    # and should be made to this test file if needed
    load_page :search, project: ['C1200187767-EDF_OPS'], bounding_box: [0, 30, 10, 40], env: :sit, authenticate: 'edsc'

    # View the project
    click_link('My Project')
    wait_for_xhr
  end

  context 'When selecting variables for subsetting' do
    before :all do
      # Find the collection card to work with
      collection_card = find('.project-list-item', match: :first)

      # Click the customize link
      collection_card.find('.project-list-item-action-edit-options').click

      # Choose to subset based on variables
      find_button('Edit Variables').click
      wait_for_xhr

      # Select the first Science Keyword listed
      find('#associated-variables a', text: 'EMISSIVITY', match: :prefer_exact).click

      # Select the first UMM Variable listed
      find('.variable-list input[value="V1200265916-EDF_OPS"]').set(true)
      find('.variable-list input[value="V1200265914-EDF_OPS"]').set(true)

      # Save the selections and return to the project page
      within '.master-overlay-panel-item-fixed-footer' do
        click_button 'Save'
        wait_for_xhr
      end
    end

    context 'When choosing to download a collection' do
      before :all do
        page.find('.button-download-data').click
        wait_for_xhr
      end

      it 'displays a link to download the links' do
        expect(page).to have_link('View/Download Data Links')
      end

      context 'When clicking the View/Download Data Link' do
        before :all do
          @ous_link_window = window_opened_by do
            click_link('View/Download Data Links')
          end
          wait_for_xhr
        end

        it 'displays OPeNDAP urls returned from OUS' do
          within_window(@ous_link_window) do
            expect(page).to have_content('Collection granule links have been retrieved')
          end
        end

        it 'displays the correct number of links from OUS' do
          within_window(@ous_link_window) do
            expect(page).to have_css('#links li', count: 6)
          end
        end

        it 'displays the selected variables correctly in the query params of each link' do
          within_window(@ous_link_window) do
            first_link = find('#links li:nth-child(1)')
            expect(first_link).to have_content('EmisIR_A_max[0:1:3][79:1:90][209:1:220]')
          end
        end

        it 'displays the selected spatial subsetting data within the link' do
          within_window(@ous_link_window) do
            first_link = find('#links li:nth-child(1)')
            expect(first_link).to have_content('Latitude[79:1:90],Longitude[209:1:220]')
          end
        end

        it 'returns the links with the correct format' do
          within_window(@ous_link_window) do
            first_link = find('#links li:nth-child(1)')
            expect(first_link).to have_content('.hdf.nc?')
          end
        end
      end
    end
  end
end
