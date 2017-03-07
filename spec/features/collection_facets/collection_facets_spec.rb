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

  context "when applied one science keyword facets and search terms filter the collections list to no results" do
    before(:all) do
      find(".facets-item", text: "Atmosphere", match: :prefer_exact).click
      fill_in :keywords, with: "somestringthatmatchesnocollections"
      wait_for_xhr
    end

    after(:all) do
      reset_search
      wait_for_xhr
    end

    it "continues to display applied facets" do
      within(:css, '.panel.keywords .panel-body.facets') do
        expect(page).to have_content("Atmosphere")
      end
    end
  end

  context "when applied multiple science keyword facets and search terms filter the collections list to no results" do
    before(:all) do
      find(".facets-item", text: "Agriculture").click
      find(".facets-item", text: "Agricultural Chemicals").click
      find(".facets-item", text: "Fertilizers").click
      fill_in :keywords, with: "somestringthatmatchesnocollections"
      wait_for_xhr
    end

    after(:all) do
      reset_search
      wait_for_xhr
    end

    it "continues to display applied science keyword facets in order" do
      within(:css, '.keywords') do
        expect(page).to have_text("Agriculture 0 Agricultural Chemicals 0 Fertilizers 0")
      end
    end
  end

  context "when applied facets and search terms filter the collections list to no results" do
    before(:all) do
      find("h3.panel-title", text: 'Project').click
      find(".facets-item", text: "EOSDIS").click
      fill_in :keywords, with: "somestringthatmatchesnocollections"
      wait_for_xhr
    end

    after(:all) do
      reset_search
      find("h3.panel-title", text: 'Project').click
    end

    it "continues to display applied facets with counts of 0" do
      expect(page).to have_content("EOSDIS 0")
    end
  end

  # EDSC-622 - We had been displaying duplicate entries with special characters escaped
  context "when applying facets containing special characters" do
    before(:all) do
      load_page :search, facets: true, env: :sit
      fill_in :keywords, with: "C1000000560-DEV08"
      wait_for_xhr
      find(".facet-title", text: "Spectral/Engineering").click
      wait_for_xhr
    end

    after(:all) do
      reset_search
    end

    it "does not display a duplicate entry with special characters escaped" do
      expect(page).to have_no_content("Spectral%2FEngineering")
    end

    it "displays the selected entry" do
      expect(page).to have_content("Spectral/Engineering")
    end
  end

  # context "when applying facets containing trailing whitespace" do
  #   before :all do
  #     find("h3.panel-title", text: 'Platform').click
  #     find(".facets-item", text: "AquaRIUS_SAC-D ").click
  #     wait_for_xhr
  #   end
  #
  #   after :all do
  #     reset_search
  #     find("h3.panel-title", text: 'Platform').click
  #   end
  #
  #   it "displays correct count on collection list pane" do
  #     facet_count = 0
  #     collection_count = -1
  #
  #     # get count from facet list
  #     within '#master-overlay-parent' do
  #       facet_count = find('h3', text: 'Platform').parent.parent.find('label.facets-item.selected').find('span.facet-item-collection-count').text
  #     end
  #
  #     # get count from collection list pane
  #     within '#collection-results' do
  #       collection_count = find('header').find('h2').find('strong').text
  #     end
  #
  #     expect(facet_count).to eq(collection_count)
  #   end
  # end

  context "when selecting a topic keyword" do
    before :all do
      find(".facet-title", text: /\AAtmosphere\z/).click
      wait_for_xhr
    end

    after(:all) do
      reset_search
    end

    it "displays term keywords" do
      expect(page).to have_content("Aerosols")
    end

    context "when selecting a term keyword" do
      before :all do
        first(".facet-title", text: /\AAerosols\z/).click
        wait_for_xhr
      end

      after :all do
        first(".facet-title", text: /\AAerosols\z/).click
        wait_for_xhr
      end

      it "displays variable_level_1 keywords" do
        expect(page).to have_content("Aerosol Extinction")
      end
    end

    context "when the top level keyword is unchecked" do
      before :all do
        first(".facet-title", text: /\AAerosols\z/).click
        wait_for_xhr
        find(".facets-item", text: "Aerosol Extinction").click
        wait_for_xhr
        find(".facet-title", text: /\AAtmosphere\z/).click
        wait_for_xhr
      end

      after :all do
        reset_search
        find(".facet-title", text: /\AAtmosphere\z/).click
        wait_for_xhr
      end

      it "removes the children keywords" do
        expect(page).to have_no_content("Aerosols")
        expect(page).to have_no_content("Aerosol Extinction")
      end
    end

    context 'when a middle level keyword is unchecked' do
      before :all do
        first(".facet-title", text: /\AAerosols\z/).click
        wait_for_xhr
        find(".facets-item", text: "Aerosol Extinction").click
        wait_for_xhr
        find(".facet-title", text: /\AAerosols\z/).click
        wait_for_xhr
      end

      after :all do
        reset_search
        find(".facet-title", text: /\AAtmosphere\z/).click
        wait_for_xhr
      end

      it 'removes the children keywords but leaves the parent' do
        expect(page).to have_css('.facets-item.selected[title="Atmosphere"]')
        expect(page).to have_no_css('.facets-item.selected[title="Aerosols"]')
        expect(page).to have_no_css('.facets-item.selected[title="Aerosol Extinction"]')
      end
    end
  end

  context "selecting a processing level facet" do
    before :all do
      find("h3.panel-title", text: 'Processing level').click
      within(:css, '.processing-levels') do
        find(".facets-item", text: "1", match: :prefer_exact).click
      end
      wait_for_xhr
    end

    after(:all) do
      reset_search
      find("h3.panel-title", text: 'Processing level').click
    end

    it "shortens the query parameter to 'fl' in the url" do
      uri = URI.parse(current_url)
      expect(uri.query).to have_content('fl=')
    end
  end

  # EDSC-790 - The metadata example was fixed
  #context "when no collections have the EARTH SCIENCE category facet" do
  #  before :all do
  #    login
  #    load_page :search, facets: true, q: 'octs'
  #  end
  #
  #  after :all do
  #    Capybara.reset_sessions!
  #    load_page :search, facets: true
  #  end
  #
  #  it "displays the first available facet's topics" do
  #    expect(page).to have_content("Ocean Optics")
  #  end
  #end

  context "selecting multiple facets from different categories" do
    before :all do
      find("h3.panel-title", text: 'Organizations').click
      within(:css, '.organizations') do
        find(".facets-item", text: "DOE/ORNL/ESD/CDIAC", match: :prefer_exact).click
      end
      wait_for_xhr

      find("h3.panel-title", text: 'Platforms').click
      within(:css, '.platforms') do
        find(".facets-item", text: "BUOYS", match: :prefer_exact).click
      end
      wait_for_xhr
      expect(page).to have_no_content("Instruments")
      expect(page).to have_no_content("Projects")
      expect(page).to have_no_content("Processing levels")

    end

    it "'AND's the results of different categories and 'OR's the results of the same category" do
      expect(page).to have_content('1 Matching Collections')

      within(:css, '.platforms') do
        find(".facets-item", text: "DC-8", match: :prefer_exact).click
      end

      expect(page).to have_content('2 Matching Collections')
    end

    context "and clear filters" do
      before :all do
        click_link "Clear Filters"
        wait_for_xhr
      end

      it "maintains the original facet category order" do
        expect(page).to have_content("WEATHER STATIONS 149 Instruments")
        find("h3.panel-title", text: 'Platforms').click
      end
    end
  end

  context "selecting multiple facets from same category" do
    before :all do
      find(".facets-item", text: "Agriculture", match: :prefer_exact).click
      expect(page).to have_content('1628 Matching Collections')
    end

    after :all do
      find(".facets-item", text: "Agriculture", match: :prefer_exact).click
      find(".facets-item", text: "Atmosphere", match: :prefer_exact).click
    end

    it "'OR's the results of the selected facets" do
      find(".facets-item", text: "Atmosphere", match: :prefer_exact).click
      expect(page).to have_content('5607 Matching Collections')
    end
  end
end
