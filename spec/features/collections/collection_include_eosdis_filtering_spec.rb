require "spec_helper"

describe 'Collection include EOSDIS filtering', reset: false do
  context "searching collections with 'Include non-EOSDIS collections' filter checked" do
    before :all do
      load_page :search
      wait_for_xhr
      find(:css, "#hasNonEOSDIS").set(true)
    end

    it 'displays all collections' do
      expect(page).to have_content('31572 Matching Collections')
    end
  end

  context "searching collections with 'Include non-EOSDIS collections' filter unchecked" do
    before :all do
      load_page :search
      wait_for_xhr
      find(:css, "#hasNonEOSDIS").set(false)
    end

    it 'only displays EOSDIS collections' do
      expect(page).to have_content('4832 Matching Collections')
    end
  end

  context "when selecting a facet filter while searching collections with 'Include non-EOSDIS collections' filter unchecked" do
    before :all do
      load_page :search, facets: true
      find("h3.panel-title", text: 'Keywords').click
      wait_for_xhr
      find(".facets-item", text: "Earth Science", match: :prefer_exact).click
      find(:css, "#hasNonEOSDIS").set(false)
    end

    it "'OR's the results of the selected facets" do
      expect(page).to have_content('4179 Matching Collections')
    end
  end
end