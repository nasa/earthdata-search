require "spec_helper"

describe "Collection with granules filtering", reset: false do
  before_collection_count = 0

  before :all do
    load_page :search, facets: true
    number_collections = collection_count_header.text.match /\d+ Matching Collections/
    before_collection_count = number_collections.to_s.split(" ")[0].to_i
  end

  it "displays collection filters to hide collections without granules" do
    expect(page).to have_content("Hide collections without granules")
  end

  it "defaults to show all the collections" do
    expect(collection_with_granule_toggle).not_to be_checked
  end

  context "when checked" do
    before :all do
      page.execute_script("document.getElementById('has-granules').click(); null;")
      wait_for_xhr
    end

    after :all do
      page.execute_script("document.getElementById('has-granules').click(); null;")
      wait_for_xhr
    end

    it "hides collections that don't have granules" do
      expect(collection_count_header).to filter_collections_from(before_collection_count)
    end
  end
end
