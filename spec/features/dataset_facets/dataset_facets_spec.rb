# EDSC-32: As a user, I want to see a list of dataset facets so that I may find
#          datasets by topic
require "spec_helper"

describe "Dataset Facets", reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search, facets: true
  end

  context "facet listing" do
    it "shows the first Project facet" do
      expect(page).to have_content("Project 2009_AN_NASA")
    end

    it "shows the first Platforms facet" do
      expect(page).to have_content("Platform AIRCRAFT")
    end

    it "shows the first Instruments facet" do
      expect(page).to have_content("Instrument AIRS")
    end

    it "shows the first Sensors facet" do
      expect(page).to have_content("Sensor AA")
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
      expect(page).to have_content("Variable Level 2 Keyword ALBATROSSES/PETRELS AND ALLIES")
    end

    it "shows the first Variable Level 3 Keyword facet" do
      expect(page).to have_content("Variable Level 3 Keyword ASH/DUST COMPOSITION")
    end

    it "shows the first Detailed Variable Keyword facet" do
      expect(page).to have_content("Detailed Variable Keyword 2.0 * TB(19V) - TB(21V)")
    end

    it "shows the first Processing Level facet" do
      expect(page).to have_content("Processing level 0")
    end

    it "collapses and expands facet lists by type" do
      expect(page).to have_css("#collapse2.facets-list-hide")

      find(".facet-title", text: "Project").click
      expect(page).to have_css("#collapse2.facets-list-show")

      find(".facet-title", text: "Project").click
      expect(page).to have_css("#collapse2.facets-list-hide")
    end
  end

  context 'when closing the facet list' do
    before :all do
      expect(page).to have_no_link('Browse Datasets')
      page.find('#master-overlay-parent .master-overlay-hide-parent').click
    end

    it "displays links to re-open the facet list" do
      expect(page).to have_link('Browse Datasets')
    end

    context 're-opening the facet list' do
      before :all do
        click_link 'Browse Datasets'
      end

      it 'hides the link to show facets' do
        expect(page).to have_no_link('Browse Datasets')
      end
    end
  end

  context "selecting facets" do
    after :each do
      reset_search
    end

    it "shows the user which facets have been applied to the query" do
      # select a project
      find(".facets-item", text: "EOSDIS").click
      wait_for_xhr
      within(:css, '.selected-facets-panel') do
        expect(page).to have_content("EOSDIS")
        expect(page).to have_css(".facets-item.selected")
      end
      expect(page).to have_css("p.facets-item.selected")

      # select a platform
      find(".facets-item", text: "FIELD INVESTIGATION").click
      wait_for_xhr
      within(:css, '.selected-facets-panel') do
        expect(page).to have_content("FIELD INVESTIGATION")
        expect(page).to have_css(".facets-item.selected")
      end
      expect(page).to have_css("p.facets-item.selected")

      # select a second project
      find(".facets-item", text: "ESIP").click
      wait_for_xhr
      within(:css, '.selected-facets-panel') do
        expect(page).to have_content("EOSDIS and ESIP")
        expect(page).to have_css(".facets-item.selected")
      end
      expect(page).to have_css("p.facets-item.selected")
    end

    context "removes facet from query on second click" do
      before :each do
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

      find(".project .facets-item", text: "AQUA").click

      expect(page).to have_no_css(".panel.processing-level .panel-heading")
    end

    it "updates the dataset results" do
      expect(page).to have_content("15 Minute Stream Flow Data: USGS (FIFE)")
      expect(page).to have_no_content("AIRS/Aqua Level 1B AMSU (A1/A2) geolocated and calibrated brightness temperatures V005")

      find(".project .facets-item", text: "AQUA").click

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS (FIFE)")
      expect(page).to have_content("AIRS/Aqua Level 1B AMSU (A1/A2) geolocated and calibrated brightness temperatures V005")
    end

    it "updates facet lists" do
      within(:css, ".project") do
        expect(page).to have_content("AQUA")
        expect(page).to have_content("AURA")

        find(".facets-item", text: "AQUA").click

        expect(page).to have_no_content("AURA")
      end
    end

    it "keeps facet lists collapsed after selecting and removing a facet" do
      expect(page).to have_css("#collapse2.facets-list-hide")
      find(".facet-title", text: "Project").click
      expect(page).to have_css("#collapse2.facets-list-show")

      within(:css, ".platform") do
        find(".facets-item", text: "AIRCRAFT").click
      end
      wait_for_xhr
      expect(page).to have_css("#collapse2.facets-list-show")

      within(:css, ".selected-facets-panel") do
        find(".facets-item", text: "AIRCRAFT").click
      end
      wait_for_xhr
      expect(page).to have_no_css(".selected-facets-panel.facets")
      expect(page).to have_css("#collapse2.facets-list-show")
      find(".facet-title", text: "Project").click
      expect(page).to have_css("#collapse2.facets-list-hide")
    end
  end

  context "when applied facets and search terms filter the datasets list to no results" do
    before(:all) do
      find(".facets-item", text: "EOSDIS").click
      fill_in :keywords, with: "somestringthatmatchesnodatasets"
      wait_for_xhr
    end

    after(:all) do
      reset_search
    end

    it "continues to display applied facets with counts of 0" do
      within '.selected-facets-panel' do
        expect(page).to have_content("EOSDIS")
      end
      expect(page).to have_content("EOSDIS (0)")
    end
  end

  # EDSC-622 - We had been displaying duplicate entries with special characters escaped
  context "when applying facets containing special characters" do
    before(:all) do
      find(".facets-item", text: "ANIMALS/VERTEBRATES").click
      wait_for_xhr
    end

    after(:all) do
      reset_search
    end

    it "does not display a duplicate entry with special characters escaped" do
      expect(page).to have_no_content("ANIMALS%2FVERTEBRATES")
    end

    it "does displays the selected entry" do
      expect(page).to have_content("ANIMALS/VERTEBRATES")
    end
  end
end
