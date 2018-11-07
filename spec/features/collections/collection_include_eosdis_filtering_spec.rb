require "spec_helper"

describe 'Collection include EOSDIS filtering' do
  context "When searching collections with 'Include non-EOSDIS collections' filter unchecked" do
    before :all do
      load_page :search, ac: true
      
      @all_collections_count = collection_results_header_value.text.to_i

      find(:css, "#hasNonEOSDIS").set(false)
      wait_for_xhr
    end

    it 'decreases the number of collections returned' do
      only_eosdis_collections = collection_results_header_value.text.to_i
      expect(@all_collections_count).to be > only_eosdis_collections
    end

    context "When checking 'Include non-EOSDIS collections'" do
      before :all do
        @only_eosdis_collections = collection_results_header_value.text.to_i

        find(:css, "#hasNonEOSDIS").set(true)
        wait_for_xhr
      end

      it 'increases the number of collections returned' do
        all_collections_count = collection_results_header_value.text.to_i
        expect(all_collections_count).to be > @only_eosdis_collections
      end
    end
  end

  context "when selecting a facet filter while searching collections with 'Include non-EOSDIS collections' filter unchecked" do
    before :all do
      load_page :search, facets: true, ac: true
      find("h3.panel-title", text: 'Keywords').click
      wait_for_xhr

      @only_eosdis_collections = collection_results_header_value.text.to_i

      find(".facets-item", text: "Atmosphere", match: :prefer_exact).click
      find(:css, "#hasNonEOSDIS").set(false)
      wait_for_xhr
    end

    it 'ORs the results of the selected facets by limiting them to EOSDIS-only collections' do
      faceted_collection_count = collection_results_header_value.text.to_i
      expect(faceted_collection_count).to be < @only_eosdis_collections
    end
  end
end
