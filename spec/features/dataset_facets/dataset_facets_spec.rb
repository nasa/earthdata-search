# EDSC_32 As a user, I want to see a list of dataset facets
#         so that I may find datasets by topic

require "spec_helper"

describe "Dataset Facets" do
  before do
    visit "/search"
  end

  context "facet listings" do
    it "shows the first Campaign facet" do
      expect(page).to have_content("Campaigns EOSDIS")
    end

    it "shows the first Platforms facet" do
      expect(page).to have_content("Platforms FIELD INVESTIGATION")
    end

    it "shows the first Instruments facet" do
      expect(page).to have_content("Instruments ANALYSIS")
    end

    it "shows the first Sensors facet" do
      expect(page).to have_content("Sensors ANALYSIS")
    end

    it "shows the first 2D Coordinate Name facet" do
      expect(page).to have_content("2D Coordinate Name MODIS Tile SIN")
    end

    it "shows the first Category Keyword facet" do
      expect(page).to have_content("Category Keyword EARTH SCIENCE")
    end

    it "shows the first Topic Keyword facet" do
      expect(page).to have_content("Topic Keyword ATMOSPHERE")
    end

    it "shows the first Term Keyword facet" do
      expect(page).to have_content("Term Keyword VEGETATION")
    end

    it "shows the first Variable Level 1 Keyword facet" do
      expect(page).to have_content("Variable Level 1 Keyword AIR TEMPERATURE")
    end

    it "shows the first Variable Level 2 Keyword facet" do
      expect(page).to have_content("Variable Level 2 Keyword OZONE")
    end

    it "shows the first Variable Level 3 Keyword facet" do
      expect(page).to have_content("Variable Level 3 Keyword TOOTHED WHALES")
    end

    it "shows the first Detailed Variable Keyword facet" do
      expect(page).to have_content("Detailed Variable Keyword TOTAL OZONE")
    end

    it "shows the first Processing Level facet" do
      expect(page).to have_content("Processing Level 3")
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

    it "removes facet from query on second click" do
      find(".facets-item", text: "EOSDIS").click
      within(:css, '.selected-facets-panel') do
        expect(page).to have_content("EOSDIS")
        expect(page).to have_css(".facets-item.selected")

        find(".facets-item", text: "EOSDIS").click
      end

      expect(page).to have_no_css(".facets-item.selected")
    end
  end
end
