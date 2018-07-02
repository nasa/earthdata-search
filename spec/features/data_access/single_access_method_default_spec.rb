require 'spec_helper'

describe 'Loading the data configuration page', reset: false do
  before :all do
    login
    load_page 'data/configure', project: ['C4521853-LARC_ASDC'], env: :prod
  end

  context 'when collections only have a single access method' do
    it 'selects the access method' do
      radio_button = find('#access-method-C4521853-LARC_ASDC-00')

      expect(radio_button).to be_checked
    end

    it 'displays the Stage for Delivery options' do
      expect(page).to have_content('Media Options')
    end
  end
end
