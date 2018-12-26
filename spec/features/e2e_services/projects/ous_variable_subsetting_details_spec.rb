require 'rails_helper'

describe 'When viewing the project page' do
  before :all do
    # This collection is specifically configured for this test on SIT. Any changes can
    # and should be made to this test file if needed
    load_page :search, project: ['C1200187767-EDF_OPS'], bounding_box: [0, 30, 10, 40], env: :sit, authenticate: 'edsc'

    # View the project
    click_link('My Project')
    wait_for_xhr
  end

  context 'When viewing variables for subsetting' do
    before :all do
      # Find the collection card to work with
      collection_card = find('.project-list-item', match: :first)

      # Click the edit link
      collection_card.find('.project-list-item-action-edit-options').click

      # Choose to subset based on variables
      find_button('Edit Variables').click
      wait_for_xhr

      # Select the first Science Keyword listed
      find('#associated-variables a', text: 'EMISSIVITY', match: :prefer_exact).click

      # Select the first UMM Variable listed
      find('.variable-list label[id="V1200265916-EDF_OPS"] .collection-variable-details-link').click
    end

    context 'When clicking the "View Details" link' do
      it 'displays the variable name' do
        el = find('.variable-details .collection-variable-name')
        expect(el).to have_content('EmisIR_A_min')
      end

      it 'displays the variable longname' do
        el = find('.variable-details .collection-variable-longname')
        expect(el).to have_content('EmisIR_A_min')
      end

      it 'displays the variable definition' do
        el = find('.variable-details .collection-variable-description')
        expect(el).to have_content('Minimum value of 32-bit floating EmisFreqIR (4) IR surface emissivity at point frequencies {832, 961, 1203, 2616} cm-1 Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.')
      end

      it 'displays a back button' do
        el = find('.master-overlay-panel-item-fixed-footer')
        expect(el).to have_content('Back')
      end
    end
  end
end
