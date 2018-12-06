require 'spec_helper'

describe 'Granule Display Name' do
  context 'when granule has producer_granule_id' do
    before :all do
      load_page :search, focus: 'C4543622-LARC_ASDC'
    end

    it 'displays the producer_granule_id as the name' do
      expect(page).to have_content('CER_SSF_Terra-FM1-MODIS_Edition3A_')
    end
  end

  context 'when granule doesn\'t have producer_granule_id' do
    before :all do
      load_page :search, focus: 'C179003030-ORNL_DAAC'
    end

    it 'displays the title as the name' do
      expect(page).to have_content('FIFE_STRM_15M.80611715.s15')
    end
  end
end
