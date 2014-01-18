# EDSC_32 As a user, I want to see a list of dataset facets
#         so that I may find datasets by topic

require "spec_helper"

describe "Dataset Facets" do
  before do
    visit "/search"
  end

  context "facet listings" do
    it "shows the first Campaign facet" do
      expect(page).to have_content("Campaigns AQUA")
    end

    it "shows the first Platforms facet" do
      expect(page).to have_content("Platforms AIRCRAFT")
    end

    it "shows the first Instruments facet" do
      expect(page).to have_content("Instruments AIRS")
    end

    it "shows the first Sensors facet" do
      expect(page).to have_content("Sensors AA")
    end

    it "shows the first 2D Coordinate Name facet" do
      expect(page).to have_content("2D Coordinate Name CALIPSO")
    end

    it "shows the first Category Keyword facet" do
      expect(page).to have_content("Category Keyword ATMOSPHERE")
    end

    it "shows the first Topic Keyword facet" do
      expect(page).to have_content("Topic Keyword AGRICULTURE")
    end

    it "shows the first Term Keyword facet" do
      expect(page).to have_content("Term Keyword AEROSOLS")
    end

    it "shows the first Variable Level 1 Keyword facet" do
      expect(page).to have_content("Variable Level 1 Keyword AIR TEMPERATURE")
    end

    it "shows the first Variable Level 2 Keyword facet" do
      expect(page).to have_content("Variable Level 2 Keyword BIODIVERSITY FUNCTIONS")
    end

    it "shows the first Variable Level 3 Keyword facet" do
      expect(page).to have_content("Variable Level 3 Keyword ASH/DUST COMPOSITION")
    end

    it "shows the first Detailed Variable Keyword facet" do
      expect(page).to have_content("Detailed Variable Keyword AEROSOL INDEX")
    end

    it "shows the first Processing Level facet" do
      expect(page).to have_content("Processing Level 0")
    end

    it "collapses and expands facet lists by type" do
      expect(page).to have_css("#collapse0.panel-collapse.in")

      find(".facet-title", text: "Campaigns").click

      expect(page).to have_css("#collapse0.panel-collapse.collapse")
    end
  end

  context "selecting facets" do
    it "shows the user which facets have been applied to the query" do
      # select a campaign
      find(".facets-item", text: "EOSDIS").click
      within(:css, '.selected-facets-panel') do
        expect(page).to have_content("EOSDIS")
        expect(page).to have_css(".facets-item.selected")
      end
      expect(page).to have_css("p.facets-item.selected")

      # select an instrument
      find(".facets-item", text: "FIELD INVESTIGATION").click
      within(:css, '.selected-facets-panel') do
        expect(page).to have_content("FIELD INVESTIGATION")
        expect(page).to have_css(".facets-item.selected")
      end
      expect(page).to have_css("p.facets-item.selected")

      # select a second campaign
      find(".facets-item", text: "LBA").click
      within(:css, '.selected-facets-panel') do
        expect(page).to have_content("EOSDIS or LBA")
        expect(page).to have_css(".facets-item.selected")
      end
      expect(page).to have_css("p.facets-item.selected")

      reset_search
    end

    context "removes facet from query on second click" do
      before do
        find(".facets-item", text: "EOSDIS").click
      end

      it "clicks remove from selected facets" do
        within(:css, '.selected-facets-panel') do
          expect(page).to have_content("EOSDIS")
          expect(page).to have_css(".facets-item.selected")

          find(".facets-item", text: "EOSDIS").click
        end

        expect(page).to have_no_css(".facets-item.selected")
      end

      it "clicks remove from facet lists" do
        find("p.facets-item", text: "EOSDIS").click
        expect(page).to have_no_css(".facets-item.selected")
      end
    end

    it "hides empty facet lists" do
      expect(page).to have_css(".panel.processing-level .panel-heading")

      find(".campaigns .facets-item", text: "AQUA").click

      expect(page).to have_no_css(".panel.processing-level .panel-heading")
    end

    it "updates the dataset results" do
      expect(page).to have_content("15 Minute Stream Flow Data: USGS (FIFE)")
      expect(page).to have_no_content("AIRS/Aqua Level 1B AMSU (A1/A2) geolocated and calibrated brightness temperatures V005")

      find(".campaigns .facets-item", text: "AQUA").click

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS (FIFE)")
      expect(page).to have_content("AIRS/Aqua Level 1B AMSU (A1/A2) geolocated and calibrated brightness temperatures V005")
    end

    it "updates facet lists" do
      within(:css, ".campaigns") do
        expect(page).to have_content("AQUA")
        expect(page).to have_content("AURA")

        find(".facets-item", text: "AQUA").click

        expect(page).to have_no_content("AURA")
      end
    end
  end
end
