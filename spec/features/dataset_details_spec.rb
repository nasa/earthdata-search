# -*- coding: utf-8 -*-
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

  context "when selecting a dataset with point spatial" do
    before do
      find('li', text: '15 Minute Stream Flow Data: USGS (FIFE)').click
    end

    it "displays the dataset's spatial bounds on the map" do
      expect(page).to have_css('#map .leaflet-marker-icon')
    end

    context "and returning to the datasets list" do
      before do
        click_link "Back to Datasets"
      end

      it "removes the dataset's spatial bounds from the map" do
        expect(page).to have_no_css('#map .leaflet-marker-icon')
      end
    end
  end

  context "when selecting a dataset with bounding box spatial" do
    before do
      find('li', text: '2000 Pilot Environmental Sustainability Index (ESI)').click
    end

    it "displays the dataset's spatial bounds on the map" do
      # Test that a path exists
      expect(page).to have_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
    end
  end

  context "when selecting a dataset with polygon spatial" do
    before do
      pending "Matthew: Remove this line when polygon spatial parsing works"
      fill_in 'keywords', with: 'NSIDC-0022'
      find('li', text: 'AVHRR Polar 1 Km Level 1B Data Set').click
    end

    it "displays the dataset's spatial bounds on the map" do
      expect(page).to have_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
    end
  end

  context "when selecting a dataset with line spatial" do
    before do
      pending "Matthew: Remove this line when line spatial parsing works"
      fill_in 'keywords', with: 'NSIDC-0239'
      find('li', text: 'SMEX02 Atmospheric Aerosol Optical Properties Data').click
    end

    it "displays the dataset's spatial bounds on the map" do
      expect(page).to have_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
    end
  end

end
