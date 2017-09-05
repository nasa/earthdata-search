# EDSC-32: As a user, I want to see a list of collection facets so that I may find
#          collections by topic
require "spec_helper"

describe "Collection Facets", reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search, facets: true, env: :sit
  end

  context "facet listing" do
    # CMR has been fixed here
    #it "shows facets in a case insensitive order" do
    #  find("h3.panel-title", text: 'Platform').click
    #  expect(page.text).to match("Aqua\\s*\\d*\\s*Aqua")
    #  find("h3.panel-title", text: 'Platform').click
    #end

    it "shows the first Project facet" do
      find("h3.panel-title", text: 'Project').click
      expect(page).to have_css('.panel.projects label.facets-item', visible: true)
      find("h3.panel-title", text: 'Project').click
    end

    it "shows the first Platforms facet" do
      find("h3.panel-title", text: 'Platform').click
      expect(page).to have_css('.panel.platforms label.facets-item', visible: true)
      find("h3.panel-title", text: 'Platform').click
    end

    it "shows the first Instrument facet" do
      find("h3.panel-title", text: 'Instrument').click
      expect(page).to have_css('.panel.instruments label.facets-item', visible: true)
      find("h3.panel-title", text: 'Instrument').click
    end

    it "does not show the 2D Coordinate Name facet" do
      within(:css, '#master-overlay-parent') do
        expect(page).to have_no_content("2D Coordinate Name")
      end
    end

    it "does not show Sensor facet" do
      within(:css, '#master-overlay-parent') do
        expect(page).to have_no_content("Sensor")
      end
    end

    it "does not show Category Keyword facet" do
      within(:css, '#master-overlay-parent') do
        expect(page).to have_no_content("Category Keyword")
      end
    end

    # it "shows the first Category Keyword facet" do
    #   find("h3.panel-title", text: 'Category Keyword').click
    #   expect(page.text).to match('Category Keyword\s*\d* Atmosphere')
    #   find("h3.panel-title", text: 'Category Keyword').click
    # end

    it "does not show the first Topic Keyword facet" do
      expect(page).to have_no_content("Topic Keyword Agriculture")
    end

    it "does not show the first Term Keyword facet" do
      expect(page).to have_no_content("Term Keyword Aerosols")
    end

    it "does not show the first Variable Level 1 Keyword facet" do
      expect(page).to have_no_content("Variable Level 1 Keyword Air Temperature")
    end

    it "does not show the first Variable Level 2 Keyword facet" do
      expect(page).to have_no_content("Variable Level 2 Keyword Albatrosses/Petrels and Allies")
    end

    it "does not show the first Variable Level 3 Keyword facet" do
      expect(page).to have_no_content("Variable Level 3 Keyword Ash/Dust Composition")
    end

    it "does not show the first Detailed Variable Keyword facet" do
      expect(page).to have_no_content("Detailed Variable Keyword 2.0 * TB(19V) - TB(21V)")
    end

    it "shows the first Processing Level facet" do
      find("h3.panel-title", text: 'Processing level').click
      expect(page).to have_css('.panel.processing-levels label.facets-item', visible: true)
      find("h3.panel-title", text: 'Processing level').click
    end

    it "collapses and expands facet lists by type" do
      expect(page).to have_css(".panel.projects .facets-list-hide")

      find("h3.panel-title", text: "Project").click
      expect(page).to have_css(".panel.projects .facets-list-show")

      find("h3.panel-title", text: "Project").click
      expect(page).to have_css(".panel.projects .facets-list-hide")
    end
  end

  context 'when closing the facet list' do
    before :all do
      expect(page).to have_no_link('Browse Collections')
      page.find('#master-overlay-parent .master-overlay-hide-parent').click
    end

    it "displays links to re-open the facet list" do
      expect(page).to have_link('Browse Collections')
    end

    context 're-opening the facet list' do
      before :all do
        click_link 'Browse Collections'
      end

      it 'hides the link to show facets' do
        expect(page).to have_no_link('Browse Collections')
      end
    end
  end

  context "selecting facets" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, facets: true, env: :sit
    end

    after :each do
      reset_search
    end

    it "shows the user which facets have been applied to the query" do
      Capybara.reset_sessions!
      load_page :search, facets: true, env: :sit
      # select a project
      find("h3.panel-title", text: 'Project').click
      find("label.facets-item", text: "ESSP").click
      wait_for_xhr
      within(:css, '#collapse5 .panel-body.facets') do
        expect(page).to have_content("ESSP")
        expect(page).to have_css(".facets-item.selected")
      end
      expect(page).to have_css("label.facets-item.selected")

      # select a platform
      find("h3.panel-title", text: 'Platform').click
      find(".facets-item", text: "Aqua").click
      wait_for_xhr
      within(:css, '.platforms') do
        expect(page).to have_content("Aqua")
        expect(page).to have_css(".facets-item.selected")
      end
      expect(page).to have_css("label.facets-item.selected")

      # select a second project
      find(".facets-item", text: "CWIC").click
      wait_for_xhr
      within(:css, '.projects') do
        expect(page).to have_content("ESSP")
        expect(page).to have_css(".facets-item.selected")
      end
      expect(page).to have_css("label.facets-item.selected")

      find("h3.panel-title", text: 'Project').click
      find("h3.panel-title", text: 'Platform').click
    end

    context "removes facet from query on second click" do
      before :all do
        find("h3.panel-title", text: 'Project').click
      end

      before :each do
        find(".facets-item", text: "ESSP").click
        wait_for_xhr
      end

      after :all do
        find("h3.panel-title", text: 'Project').click
      end

      it "clicks remove from selected facets" do
        within(:css, '.projects') do
          expect(page).to have_content("ESSP")
          expect(page).to have_css(".facets-item.selected")

          find(".facets-item", text: "ESSP").click
        end

        expect(page).to have_no_css(".facets-item.selected")
      end

      it "clicks remove from facet lists" do
        find("label.facets-item", text: "ESSP").click
        expect(page).to have_no_css(".facets-item.selected")
      end
    end

    it "hides empty facet lists" do
      expect(page).to have_css(".panel.processing-levels .panel-heading")

      find("h3.panel-title", text: 'Project').click
      find(".projects label.facets-item", text: "ESSP").click

      expect(page).to have_no_css(".panel.processing-levels .panel-heading")

      find("h3.panel-title", text: 'Project').click
    end

    it "updates the collection results" do
      expect(page).to have_no_content("CloudSat 1B-CPR product version 008")

      find("h3.panel-title", text: 'Project').click
      find(".panel.projects label.facets-item", text: "ESSP").click

      expect(page).to have_content("CloudSat 1B-CPR product version 008")

      find("h3.panel-title", text: 'Project').click
    end

    it "updates facet lists" do
      find("h3.panel-title", text: 'Project').click
      within(:css, ".projects") do
        expect(page).to have_content("AMBS")
      end

      find("h3.panel-title", text: 'Platforms').click
      find("label.facets-item", text: "Aqua").click
      find("h3.panel-title", text: 'Platforms').click

      within(:css, ".projects") do
        expect(page).to have_no_content("AMBS")
      end

      find("h3.panel-title", text: 'Project').click
    end

    it "keeps facet lists collapsed after selecting and removing a facet" do
      find("h3.panel-title", text: 'Platform').click
      within(:css, ".platforms") do
        find("label.facets-item", text: "AIRCRAFT").click
      end
      wait_for_xhr
      expect(page).to have_css(".panel.platforms .facets-list-show")

      within(:css, ".platforms") do
        find("label.facets-item", text: "AIRCRAFT").click
      end
      wait_for_xhr
      expect(page).to have_no_css(".facets-items.selected")
      expect(page).to have_css(".panel.platforms .facets-list-show")

      find("h3.panel-title", text: 'Platform').click
    end
  end

end
