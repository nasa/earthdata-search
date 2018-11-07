require 'spec_helper'

describe 'Granule Display Name' do
  before :all do
    Capybara.reset_sessions!

    page.set_rack_session(cmr_env: :prod)
  end

  context 'when granule has producer_granule_id' do
    before :all do
      visit '/search/granules?p=C4543622-LARC_ASDC'
      wait_for_xhr
    end

    it 'displays the producer_granule_id as the name' do
      expect(page).to have_content('CER_SSF_Terra-FM1-MODIS_Edition3A_')
    end
  end

  context 'when granule doesn\'t have producer_granule_id' do
    before :all do
      visit '/search/granules?p=C179003030-ORNL_DAAC'
      wait_for_xhr
    end

    it 'displays the title as the name' do
      expect(page).to have_content('FIFE_STRM_15M.80611715.s15')
    end
  end
end
