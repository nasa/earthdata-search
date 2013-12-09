require 'spec_helper'

describe 'Dataset details' do
  before do
    visit '/'
  end

  shared_browser_session do
    it 'displays the dataset details' do
      fill_in 'keywords', with: 'AST_L1AE'
      expect(page).to have_content('ASTER Expedited L1A')
      find('li', text: 'ASTER Expedited L1A').click
      within('#dataset-details') do
        expect(page).to have_content('ASTER Expedited L1A Reconstructed Unprocessed Instrument Data V003')
        expect(page).to have_content('Archive Center: LPDAAC')
        expect(page).to have_content('Processing Center: EDC')
        expect(page).to have_content('Short Name: AST_L1AE')
        expect(page).to have_content('Version: 3')
        expect(page).to have_content('Contacts: LP DAAC User Services 605-594-6116 (phone) 605-594-6963 (fax) edc@eos.nasa.gov')
        expect(page).to have_content('Spatial Extent: Bounding Rectangle: (90°, -180°, -90°, 180°)')
        expect(page).to have_content('Temporal Extent: 1999-12-18T00:00:00.000Z to 2014-12-18T00:00:00.000Z')
        expect(page).to have_content('Science Keywords: EARTH SCIENCE >> SPECTRAL/ENGINEERING >> INFRARED WAVELENGTHS')
      end
    end
  end

end
