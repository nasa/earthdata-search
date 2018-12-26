require 'rails_helper'

describe 'Search Toolbar UI' do
  before :all do
    load_page :search
  end

  context 'When opening the temporal dropdown' do
    before :all do
      find('.temporal-dropdown-button').click
    end

    it 'displays the temporal dropdown' do
      expect(page).to have_content('Start')
    end

    context 'Then opening the Spatial dropdown' do
      before do
        find('.spatial-dropdown-button').click
      end

      it 'closes the temporal dropdown' do
        expect(page).to have_no_content('Start')
      end
    end
  end
end
