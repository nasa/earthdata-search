# EDSC-20 As a user, I want to search for datasets by spatial point so that I
#         may limit my results to my point of interest

require "spec_helper"

describe "Spatial" do
  before do
    visit "/search"

    # Close the overlay
    within ".master-overlay-main #dataset-results" do
      click_link "close"
    end
  end

  let(:spatial_dropdown) do
    page.find('#main-toolbar .spatial-dropdown-button')
  end

  let(:point_button)     { page.find('#map .leaflet-draw-draw-marker') }
  let(:rectangle_button) { page.find('#map .leaflet-draw-draw-rectangle') }
  let(:polygon_button)   { page.find('#map .leaflet-draw-draw-polygon') }

  context "tool selection" do
    context "when no tool is currently selected" do
      context "choosing the point selection tool from the site toolbar" do
        before(:each) { choose_tool_from_site_toolbar('Point') }

        it "selects the point selection tool in both toolbars" do
          expect(spatial_dropdown).to have_text('Point')
          expect(point_button).to have_class('leaflet-draw-toolbar-button-enabled')
        end
      end

      context "choosing the point selection tool from the map toolbar" do
        before(:each) { choose_tool_from_map_toolbar('Point') }

        it "selects the point selection tool in both toolbars" do
          expect(spatial_dropdown).to have_text('Point')
          expect(point_button).to have_class('leaflet-draw-toolbar-button-enabled')
        end
      end
    end
    context "when another tool is currently selected" do
      before(:each) { choose_tool_from_map_toolbar('Rectangle') }

      context "choosing the point selection tool in the site toolbar" do
        before(:each) { choose_tool_from_site_toolbar('Point') }

        it "selects the point selection tool in both toolbars" do
          expect(spatial_dropdown).to have_text('Point')
          expect(point_button).to have_class('leaflet-draw-toolbar-button-enabled')
        end
      end

      context "choosing the point selection tool in the map toolbar" do
        before(:each) { choose_tool_from_map_toolbar('Point') }

        it "selects the point selection tool in both toolbars" do
          expect(spatial_dropdown).to have_text('Point')
          expect(point_button).to have_class('leaflet-draw-toolbar-button-enabled')
        end
      end
    end


    context "choosing a tool when a point is already selected" do
      before(:each) do
        create_point
        choose_tool_from_map_toolbar('Rectangle')
      end

      it "removes the point from the map" do
        expect(page).to have_no_css('#map .leaflet-marker-icon')
      end

      context 'and clicking "Cancel"' do
        before(:each) do
          within "#map" do
            click_link "Cancel"
          end
        end

        it "adds the removed point back to the map" do
          expect(page).to have_css('#map .leaflet-marker-icon')
        end
      end
    end

    context "canceling the point selection in the toolbar" do
      before(:each) do
        choose_tool_from_map_toolbar('Point')
        within "#map" do
          click_link "Cancel"
        end
      end

      it "deselects the point selection tool in the site toolbar" do
        expect(spatial_dropdown).to have_text('Spatial')
      end
    end
  end

  context "point selection" do
    it "filters datasets using the selected point" do
      create_point(0, 0)
      click_link "Browse All Data"
      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("2000 Pilot Environmental Sustainability Index")
    end

    context "changing the point selection" do
      before(:each) do
        create_point(0, 0)
        create_point(-75, 40)
        click_link "Browse All Data"
      end

      it "updates the dataset filters using the new point selection" do
        expect(page).to have_content("A Global Database of Soil Respiration Data, Version 1.0")
      end
    end

    context "removing the point selection" do
      before(:each) do
        create_point(0, 0)
        clear_spatial
        click_link "Browse All Data"
      end

      it "removes the spatial point dataset filter" do
        expect(page).to have_content("15 Minute Stream Flow Data: USGS")
      end
    end
  end

  context "bounding box selection" do
    it "filters datasets using the selected bounding box" do
      create_bounding_box(0, 0, 10, 10)
      click_link "Browse All Data"
      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("2000 Pilot Environmental Sustainability Index")
    end

    context "changing the point selection" do
      before(:each) do
        create_bounding_box(0, 0, 10, 10)
        create_bounding_box(-75, 40, -74, 41)
        click_link "Browse All Data"
      end

      it "updates the dataset filters using the new bounding box selection" do
        expect(page).to have_content("A Global Database of Soil Respiration Data, Version 1.0")
      end
    end

    context "removing the bounding box selection" do
      before(:each) do
        create_bounding_box(0, 0, 10, 10)
        clear_spatial
        click_link "Browse All Data"
      end

      it "removes the spatial bounding box dataset filter" do
        expect(page).to have_content("15 Minute Stream Flow Data: USGS")
      end
    end

    it "filters datasets using north polar bounding boxes in the north polar projection" do
      click_link "North Polar Stereographic"
      create_arctic_rectangle([10, 10], [10, -10], [-10, -10], [-10, 10])
      click_link "Browse All Data"
      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("2000 Pilot Environmental Sustainability Index")
    end

    it "filters datasets using south polar bounding boxes in the south polar projection" do
      click_link "South Polar Stereographic"
      create_antarctic_rectangle([10, 10], [10, -10], [-10, -10], [-10, 10])
      click_link "Browse All Data"
      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("2000 Pilot Environmental Sustainability Index")
    end
  end

  context "polygon selection" do
    it "filters datasets using the selected polygon" do
      create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])
      click_link "Browse All Data"
      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("2000 Pilot Environmental Sustainability Index")
    end

    it "displays errors for invalid polygons" do
      create_polygon([10, 10], [-10, -10], [10, -10], [-10, 10])
      expect(page).to have_content("Polygon boundaries must not cross themselves")
    end

    context "changing the point selection" do
      before(:each) do
        create_polygon([10, 10], [-10, -10], [10, -10], [-10, 10])
        create_polygon([-74, 41], [-75, 41], [-75, -40], [-74, 40])
        click_link "Browse All Data"
      end

      it "updates the dataset filters using the new bounding box selection" do
        expect(page).to have_content("A Global Database of Soil Respiration Data, Version 1.0")
      end
    end

    context "removing the bounding box selection" do
      before(:each) do
        create_polygon([10, 10], [10, -10], [-10, -10], [-10, -10])
        clear_spatial
        click_link "Browse All Data"
      end

      it "removes the spatial bounding box dataset filter" do
        expect(page).to have_content("15 Minute Stream Flow Data: USGS")
      end
    end
  end
end
