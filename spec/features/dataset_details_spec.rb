# -*- coding: utf-8 -*-
require 'spec_helper'

describe 'Dataset details', reset: false do
  it 'displays the dataset details' do
    load_page :search
    fill_in 'keywords', with: 'AST_L1AE'
    expect(page).to have_content('ASTER Expedited L1A')
    first_dataset_result.click_link('View details')
    within('#dataset-details') do
      expect(page).to have_content('ASTER Expedited L1A Reconstructed Unprocessed Instrument Data V003')
      expect(page).to have_content('Archive Center: LPDAAC')
      expect(page).to have_content('Processing Center: EDC')
      expect(page).to have_content('Short Name: AST_L1AE')
      expect(page).to have_content('Version: 3')
      expect(page).to have_content('Contacts: LP DAAC User Services 605-594-6116 (phone) 605-594-6963 (fax) edc@eos.nasa.gov')
      expect(page).to have_content('Spatial Extent: Bounding Rectangle: (90.0°, -180.0°, -90.0°, 180.0°)')
      expect(page).to have_content('Temporal Extent: 1999-12-18T00:00:00Z to 2014-12-18T00:00:00Z')
      expect(page).to have_content('Science Keywords: EARTH SCIENCE >> SPECTRAL/ENGINEERING >> INFRARED WAVELENGTHS')
    end
  end

  context "when selecting a dataset with point spatial" do
    before :all do
      load_page :search
      expect(page).to have_content('15 Minute Stream Flow Data: USGS (FIFE)')
      first_dataset_result.click_link('View details')
    end

    it "displays the dataset's spatial bounds on the map" do
      expect(page).to have_css('#map .leaflet-marker-icon')
    end

    context "and returning to the datasets list" do
      before :all do
        wait_for_xhr
        click_link "Back to Datasets"
      end

      it "removes the dataset's spatial bounds from the map" do
        expect(page).to have_no_css('#map .leaflet-marker-icon')
      end
    end
  end

  context "when selecting a dataset with bounding box spatial" do
    before :all do
      load_page :search
      expect(page).to have_content('2000 Pilot Environmental Sustainability Index (ESI)')
      second_dataset_result.click_link('View details')
    end

    it "displays the dataset's spatial bounds on the map" do
      # Test that a path exists
      expect(page).to have_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
    end
  end

  context "when selecting a dataset with polygon spatial" do
    before :all do
      load_page :search
      fill_in 'keywords', with: 'NSIDC-0022'
      expect(page).to have_content('AVHRR Polar 1 Km Level 1B Data Set')
      first_dataset_result.click_link('View details')
    end

    it "displays the dataset's spatial bounds on the map" do
      expect(page).to have_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
    end
  end

  context "when selecting a dataset with line spatial" do
    before :all do
      load_page :search
      fill_in 'keywords', with: 'NSIDC-0239'
      expect(page).to have_content('SMEX02 Atmospheric Aerosol Optical Properties Data')
      first_dataset_result.click_link('View details')
    end

    it "displays the dataset's spatial bounds on the map" do
      expect(page).to have_css('#map .leaflet-overlay-pane svg.leaflet-zoom-animated path')
    end
  end

end
