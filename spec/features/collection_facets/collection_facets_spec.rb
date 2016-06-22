# EDSC-32: As a user, I want to see a list of collection facets so that I may find
#          collections by topic
require "spec_helper"

describe "Collection Facets", reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search, facets: true
  end

  context "facet listing" do
    # CMR has been fixed here
    #it "shows facets in a case insensitive order" do
    #  find("h3.facet-title", text: 'Platform').click
    #  expect(page.text).to match("Aqua\\s*\\d*\\s*AQUA")
    #  find("h3.facet-title", text: 'Platform').click
    #end

    it "shows the first Project facet" do
      find("h3.facet-title", text: 'Project').click
      expect(page).to have_css('.panel.project .facets-item', visible: true)
      find("h3.facet-title", text: 'Project').click
    end

    it "shows the first Platforms facet" do
      find("h3.facet-title", text: 'Platform').click
      expect(page).to have_css('.panel.platform .facets-item', visible: true)
      find("h3.facet-title", text: 'Platform').click
    end

    it "shows the first Instrument facet" do
      find("h3.facet-title", text: 'Instrument').click
      expect(page).to have_css('.panel.instrument .facets-item', visible: true)
      find("h3.facet-title", text: 'Instrument').click
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
    #   find("h3.facet-title", text: 'Category Keyword').click
    #   expect(page.text).to match('Category Keyword\s*\d* ATMOSPHERE')
    #   find("h3.facet-title", text: 'Category Keyword').click
    # end

    it "does not show the first Topic Keyword facet" do
      expect(page).to have_no_content("Topic Keyword AGRICULTURE")
    end

    it "does not show the first Term Keyword facet" do
      expect(page).to have_no_content("Term Keyword AEROSOLS")
    end

    it "does not show the first Variable Level 1 Keyword facet" do
      expect(page).to have_no_content("Variable Level 1 Keyword AIR TEMPERATURE")
    end

    it "does not show the first Variable Level 2 Keyword facet" do
      expect(page).to have_no_content("Variable Level 2 Keyword ALBATROSSES/PETRELS AND ALLIES")
    end

    it "does not show the first Variable Level 3 Keyword facet" do
      expect(page).to have_no_content("Variable Level 3 Keyword ASH/DUST COMPOSITION")
    end

    it "does not show the first Detailed Variable Keyword facet" do
      expect(page).to have_no_content("Detailed Variable Keyword 2.0 * TB(19V) - TB(21V)")
    end

    it "shows the first Processing Level facet" do
      find("h3.facet-title", text: 'Processing level').click
      expect(page).to have_css('.panel.processing-level .facets-item', visible: true)
      find("h3.facet-title", text: 'Processing level').click
    end

    it "collapses and expands facet lists by type" do
      expect(page).to have_css("#collapse2.facets-list-hide")

      find("h3.facet-title", text: "Project").click
      expect(page).to have_css("#collapse2.facets-list-show")

      find("h3.facet-title", text: "Project").click
      expect(page).to have_css("#collapse2.facets-list-hide")
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
    after :each do
      reset_search
    end

    it "shows the user which facets have been applied to the query" do
      Capybara.reset_sessions!
      load_page :search, facets: true
      # select a project
      find("h3.facet-title", text: 'Project').click
      find("p.facets-item", text: "EOSDIS").click
      wait_for_xhr
      within(:css, '#collapse2 .panel-body.facets') do
        expect(page).to have_content("EOSDIS")
        expect(page).to have_css(".facets-item.selected")
      end
      expect(page).to have_css("p.facets-item.selected")

      # select a platform
      find("h3.facet-title", text: 'Platform').click
      find(".facets-item", text: "FIELD INVESTIGATION").click
      wait_for_xhr
      within(:css, '.platform') do
        expect(page).to have_content("FIELD INVESTIGATION")
        expect(page).to have_css(".facets-item.selected")
      end
      expect(page).to have_css("p.facets-item.selected")

      # select a second project
      find(".facets-item", text: "ESIP").click
      wait_for_xhr
      within(:css, '.project') do
        expect(page).to have_content("EOSDIS")
        expect(page).to have_css(".facets-item.selected")
      end
      expect(page).to have_css("p.facets-item.selected")

      find("h3.facet-title", text: 'Project').click
      find("h3.facet-title", text: 'Platform').click
    end

    context "removes facet from query on second click" do
      before :all do
        find("h3.facet-title", text: 'Project').click
      end

      before :each do
        find(".facets-item", text: "EOSDIS").click
      end

      after :all do
        find("h3.facet-title", text: 'Project').click
      end

      it "clicks remove from selected facets" do
        within(:css, '.project') do
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

      find("h3.facet-title", text: 'Project').click
      find(".project p.facets-item", text: "AQUA").click

      expect(page).to have_no_css(".panel.processing-level .panel-heading")

      find("h3.facet-title", text: 'Project').click
    end

    it "updates the collection results" do
      expect(page).to have_no_content("AIRABRAD_NRT")

      find("h3.facet-title", text: 'Project').click
      find(".project .facets-item", text: "AQUA").click

      expect(page).to have_content("AIRABRAD_NRT")

      find("h3.facet-title", text: 'Project').click
    end

    it "updates facet lists" do
      find("h3.facet-title", text: 'Project').click
      within(:css, ".project") do
        expect(page).to have_content("AQUA")
        expect(page).to have_content("AURA")

        find("p.facets-item", text: "AQUA").click

        expect(page).to have_no_content("AURA")
      end
      find("h3.facet-title", text: 'Project').click
    end

    it "keeps facet lists collapsed after selecting and removing a facet" do
      expect(page).to have_css("#collapse2.facets-list-hide")
      find("h3.facet-title", text: "Project").click
      expect(page).to have_css("#collapse2.facets-list-show")

      find("h3.facet-title", text: 'Platform').click
      within(:css, ".platform") do
        find("p.facets-item", text: "AIRCRAFT").click
      end
      wait_for_xhr
      expect(page).to have_css("#collapse2.facets-list-show")

      within(:css, ".platform") do
        find("p.facets-item", text: "AIRCRAFT").click
      end
      wait_for_xhr
      expect(page).to have_no_css(".facets-items.selected")
      expect(page).to have_css("#collapse2.facets-list-show")
      find("h3.facet-title", text: "Project").click
      expect(page).to have_css("#collapse2.facets-list-hide")

      find("h3.facet-title", text: 'Platform').click
    end
  end

  context "when applied one science keyword facets and search terms filter the collections list to no results" do
    before(:all) do
      find(".facets-item", text: "ATMOSPHERE", match: :prefer_exact).click
      fill_in :keywords, with: "somestringthatmatchesnocollections"
      wait_for_xhr
    end

    after(:all) do
      reset_search
      wait_for_xhr
    end

    it "continues to display applied facets" do
      within(:css, '#collapse1 .panel-body.facets') do
        expect(page).to have_content("ATMOSPHERE")
      end
    end
  end

  context "when applied multiple science keyword facets and search terms filter the collections list to no results" do
    before(:all) do
      find(".facets-item", text: "AGRICULTURE").click
      find(".facets-item", text: "AGRICULTURAL CHEMICALS").click
      find(".facets-item", text: "FERTILIZERS").click
      fill_in :keywords, with: "somestringthatmatchesnocollections"
      wait_for_xhr
    end

    after(:all) do
      reset_search
      wait_for_xhr
    end

    it "continues to display applied science keyword facets in order" do
      within(:css, '#collapse1 .panel-body.facets') do
        expect(page).to have_text("AGRICULTURE AGRICULTURAL CHEMICALS FERTILIZERS")
      end
    end
  end

  context "when applied facets and search terms filter the collections list to no results" do
    before(:all) do
      find("h3.facet-title", text: 'Project').click
      find(".facets-item", text: "EOSDIS").click
      fill_in :keywords, with: "somestringthatmatchesnocollections"
      wait_for_xhr
    end

    after(:all) do
      reset_search
      find("h3.facet-title", text: 'Project').click
    end

    it "continues to display applied facets with counts of 0" do
      expect(page).to have_content("EOSDIS 0")
    end
  end

  # EDSC-622 - We had been displaying duplicate entries with special characters escaped
  context "when applying facets containing special characters" do
    before(:all) do
      load_page :search, facets: true
      fill_in :keywords, with: "C1214606011-SCIOPS"
      wait_for_xhr
      find(".facet-term", text: "SPECTRAL/ENGINEERING").click
      wait_for_xhr
    end

    after(:all) do
      reset_search
    end

    it "does not display a duplicate entry with special characters escaped" do
      expect(page).to have_no_content("SPECTRAL%2FENGINEERING")
    end

    it "displays the selected entry" do
      expect(page).to have_content("SPECTRAL/ENGINEERING")
    end
  end

  # context "when applying facets containing trailing whitespace" do
  #   before :all do
  #     find("h3.facet-title", text: 'Platform').click
  #     find(".facets-item", text: "AQUARIUS_SAC-D ").click
  #     wait_for_xhr
  #   end
  #
  #   after :all do
  #     reset_search
  #     find("h3.facet-title", text: 'Platform').click
  #   end
  #
  #   it "displays correct count on collection list pane" do
  #     facet_count = 0
  #     collection_count = -1
  #
  #     # get count from facet list
  #     within '#master-overlay-parent' do
  #       facet_count = find('h3', text: 'Platform').parent.parent.find('p.facets-item.selected').find('span.facet-item-collection-count').text
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
      find(".facet-term", text: /\AATMOSPHERE\z/).click
      wait_for_xhr
    end

    after(:all) do
      reset_search
    end

    it "displays term keywords" do
      expect(page).to have_content("AEROSOLS")
    end

    context "when selecting a term keyword" do
      before :all do
        first(".facet-term", text: /\AAEROSOLS\z/).click
        wait_for_xhr
      end

      after :all do
        first(".facet-term", text: /\AAEROSOLS\z/).click
        wait_for_xhr
      end

      it "displays variable_level_1 keywords" do
        expect(page).to have_content("AEROSOL EXTINCTION")
      end
    end

    context "when the top level keyword is unchecked" do
      before :all do
        first(".facet-term", text: /\AAEROSOLS\z/).click
        wait_for_xhr
        find(".facets-item", text: "AEROSOL EXTINCTION").click
        wait_for_xhr
        find(".facet-term", text: /\AATMOSPHERE\z/).click
        wait_for_xhr
      end

      after :all do
        reset_search
        find(".facet-term", text: /\AATMOSPHERE\z/).click
        wait_for_xhr
      end

      it "removes the children keywords" do
        expect(page).to have_no_content("AEROSOLS")
        expect(page).to have_no_content("AEROSOL EXTINCTION")
      end
    end
  end

  context "selecting a processing level facet" do
    before :all do
      find("h3.facet-title", text: 'Processing level').click
      within(:css, '.processing-level') do
        find(".facets-item", text: "1", match: :prefer_exact).click
      end
      wait_for_xhr
    end

    after(:all) do
      reset_search
      find("h3.facet-title", text: 'Processing level').click
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
end
