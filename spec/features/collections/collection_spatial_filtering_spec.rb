require "spec_helper"

describe "Spatial manual entry", reset: false do
  before :all do
    load_page :search
  end
  
  context "Spatial" do
    before :each do
      load_page :search
    end

    context "point manual entry" do
      it "filters collections using the selected point" do
        manually_create_point(67, -155)
        wait_for_xhr
        expect(page).to have_no_content("15 Minute Stream Flow Data: USGS (FIFE)")
        expect(page).to have_content("A Global Database of Carbon and Nutrient Concentrations of Green and Senesced Leaves")
      end

      it "displays point coordinates in the manual entry text box" do
        manually_create_point(67, -155)
        wait_for_xhr
        expect(page).to have_field('manual-coord-entry-point', with: '67,-155')
      end

      it "displays an error message when invalid coordinates are entered" do
        manually_create_point(67, -1155)
        expect(page).to have_text('Lon [-1155] must be between -180 and 180')
      end

      context "changing the point selection" do
        before(:each) do
          manually_create_point(0, 0)
          wait_for_xhr
          expect(page).to have_field('manual-coord-entry-point', with: '0,0')
          manually_create_point(-75, 40)
          wait_for_xhr
        end

        it "updates the coordinates in the manual entry box" do
          expect(page).to have_field('manual-coord-entry-point', with: '-75,40')
        end

        it "updates the collection filters using the new point selection" do
          expect(page).to have_no_content("2000 Pilot Environmental Sustainability Index")
        end
      end

      context "removing the point selection" do
        before(:each) do
          manually_create_point(0, 0)
          wait_for_xhr
          clear_spatial
          wait_for_xhr
        end

        it "removes the spatial point in the manual entry box" do
          expect(page).not_to have_field('manual-coord-entry-point', with: '0,0')
        end

        it "removes the spatial point collection filter" do
          expect(page).to have_content("15 Minute Stream Flow Data: USGS (FIFE)")
        end
      end
    end

    context "bounding box manual entry" do
      it "filters collections using the selected bounding box" do
        manually_create_bounding_box(0, 0, 10, 10)
        wait_for_xhr
        expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
        expect(page).to have_content("A Compilation of Global Soil Microbial Biomass Carbon, Nitrogen, and Phosphorus Data")
      end

      it "displays bounding box points in the manual entry text boxes" do
        expect(page).not_to have_field('manual-coord-entry-swpoint', with: '0,0')
        expect(page).not_to have_field('manual-coord-entry-nepoint', with: '10,10')
      end

      it "displays an error message when invalid coordinates are entered" do
        manually_create_bounding_box(66, 0, 10, -1155)
        expect(page).to have_text('Lon [-1155] must be between -180 and 180.')
      end

      context "changing the bounding box selection" do
        before(:each) do
          manually_create_bounding_box(0, 0, 10, 10)
          wait_for_xhr
          manually_create_bounding_box(-174, 69, -171, 72)
          wait_for_xhr
        end

        it "updates the coordinates in the manual entry text boxes" do
          expect(page).to have_field('manual-coord-entry-swpoint', with: '-174,69')
          expect(page).to have_field('manual-coord-entry-nepoint', with: '-171,72')
        end

        it "updates the collection filters using the new bounding box selection" do
          expect(page).to have_content("ACOS GOSAT/TANSO-FTS Level 2 Full Physics Standard Product V3.5 (ACOS_L2S) at GES DISC")
        end
      end

      context "removing the bounding box selection" do
        before(:each) do
          manually_create_bounding_box(0, 0, 10, 10)
          wait_for_xhr
          clear_spatial
          wait_for_xhr
        end

        it "removes the spatial point in the manual entry text boxes" do
          expect(page).not_to have_field('manual-coord-entry-swpoint', with: '0,0')
          expect(page).not_to have_field('manual-coord-entry-nepoint', with: '10,10')
        end

        it "removes the spatial bounding box collection filter" do
          expect(page).to have_content("15 Minute Stream Flow Data: USGS")
        end
      end
    end
  end
end
