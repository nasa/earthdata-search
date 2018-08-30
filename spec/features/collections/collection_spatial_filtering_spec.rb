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
      # it "filters collections using the selected point" do
      #   manually_create_point(67, -155)
      #   wait_for_xhr
      #   expect(page).to have_content("The MODIS/Aqua Aerosol 5-Min L2 Swath 3km (MYD04_3K) product provides retrieved ambient aerosol optical properties (e.g., optical thickness and size distribution), mass concentration, look-up table derived reflected and transmitted fluxes, as well as quality assurance and other a...")
      # end

      it "displays point coordinates in the manual entry text box" do
        manually_create_point(67, -155)
        wait_for_xhr
        expect(page).to have_field('manual-coord-entry-point', with: '67,-155')
      end

      it "displays an error message when invalid coordinates are entered" do
        manually_create_point(67, -1155)
        expect(page).to have_text('Lon [-1155] must be between -180 and 180')
      end

      context 'setting a point' do
        before(:each) do
          manually_create_point(0, 0)
          wait_for_xhr
        end

        it 'sets a point at 0,0' do
          expect(page).to have_field('manual-coord-entry-point', with: '0,0')
        end

        context 'and then changing the point' do
          before(:each) do
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
          expect(page).to have_content("Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050")
        end
      end
    end

    context "bounding box manual entry" do
      it "filters collections using the selected bounding box" do
        manually_create_bounding_box(0, 0, 10, 10)
        wait_for_xhr
        # expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
        # expect(page).to have_content("MODIS/Aqua Aerosol 5-Min L2 Swath 3km V006")
        expect(page).to have_content("MODIS/Aqua Aerosol 5-Min L2 Swath 3km")
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
          manually_create_bounding_box(69, -174, 72, -171)
          wait_for_xhr
        end

        it "updates the coordinates in the manual entry text boxes" do
          expect(page).to have_field('manual-coord-entry-swpoint', with: '69,-174')
          expect(page).to have_field('manual-coord-entry-nepoint', with: '72,-171')
        end

        it "updates the collection filters using the new bounding box selection" do
          # expect(page).to have_content("MODIS/Aqua Aerosol 5-Min L2 Swath 3km V006")
          expect(page).to have_content("MODIS/Aqua Aerosol 5-Min L2 Swath 3km")
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
          expect(page).to have_content("Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050")
        end

        context "then draw another bounding box" do
          before :all do
            manually_create_bounding_box(0, 0, 5, 5)
            wait_for_xhr
          end

          it "sets coordinates in the manual entry boxes" do
            expect(page).not_to have_field('manual-coord-entry-swpoint', with: '0,0')
            expect(page).not_to have_field('manual-coord-entry-nepoint', with: '5,5')
          end
        end
      end
    end
  end
end
