require "spec_helper"

describe "Collection Facets", reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search, facets: true, env: :sit
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

  context "when applied one science keyword facets and search terms filter the collections list to no results" do
    before(:all) do
      load_page :search, facets: true, env: :sit
      find("h3.panel-title", text: 'Keywords').click
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

  # EDSC-622 - We had been displaying duplicate entries with special characters escaped
  context "when applying facets containing special characters" do
    before(:all) do
      load_page :search, facets: true, env: :sit
      fill_in :keywords, with: "C1000000560-DEV08"
      wait_for_xhr
      find("h3.panel-title", text: 'Keywords').click
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
end