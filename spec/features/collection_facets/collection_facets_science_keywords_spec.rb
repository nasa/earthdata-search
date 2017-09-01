require "spec_helper"

describe "Collection Science Keywords Facets", reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search, facets: true, env: :sit
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

  context "when applied multiple science keyword facets" do
    before :all do
      load_page :search, facets: true, env: :sit
      find("h3.panel-title", text: 'Keywords').click
      find(".facets-item", text: "Agriculture").click
      find(".facets-item", text: "Agricultural Chemicals").click
      find(".facets-item", text: "Fertilizers").click
    end

    it 'shows the select facet siblings' do
      expect(page).to have_content("Agricultural Commodities")
      expect(page).to have_content("Agricultural Engineering")
    end

    context "and search terms filter the collections list to no results" do
      before(:all) do
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
  end

  context "when selecting a topic keyword" do
    before :all do
      load_page :search, facets: true, env: :sit
      find("h3.panel-title", text: 'Keywords').click
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

  context "selecting multiple facets from same category" do
    before :all do
      load_page :search, facets: true, env: :sit
      find("h3.panel-title", text: 'Keywords').click
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