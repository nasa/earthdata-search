require 'spec_helper'

describe 'When viewing the project page', reset: false, pending_updates: true do
  before :all do
    # This collection is specifically configured for this test on SIT. Any changes can
    # and should be made to this test file if needed
    load_page :search, project: ['C1200187767-EDF_OPS'], bounding_box: [0, 30, 10, 40], env: :sit

    login
    wait_for_xhr

    # View the project
    click_link('My Project')
    wait_for_xhr
  end

  context 'When viewing variables for subsetting' do
    before :all do
      # Find the collection card to work with
      collection_card = find('.collection-card', match: :first)

      # Click the customize link
      collection_card.find('.action-button.customize').click

      # Choose to subset based on variables
      click_link('Variable Selection')
      wait_for_xhr

      # Select the first Science Keyword listed
      find('#associated-variables a', text: 'EMISSIVITY', match: :prefer_exact).click

      # Select the first UMM Variable listed
      find('.variable-list label[id="V1200266664-EDF_OPS"] .collection-variable-details-link').click
    end

    context 'When clicking the "View Details" link' do

      it 'displays a "Back to Variables" link' do
        expect(page).to have_css('.variable-details .button-back', count: 1)
      end

      it 'displays the variable name' do
        el = find('.variable-details .collection-variable-name')
        expect(el).to have_content('TotalCounts_A')
      end

      it 'displays the variable longname' do
        el = find('.variable-details .collection-variable-longname')
        expect(el).to have_content('TotalCounts_A')
      end

      it 'displays the variable definition' do
        el = find('.variable-details .collection-variable-description')
        expect(el).to have_content('TotalCounts_A in units of None')
      end

      it 'displays a back button' do
        el = find('.action-container .button.secondary')
        expect(el).to have_content('Back')
      end
    end
  end
end
