require 'spec_helper'

describe 'Collection CWIC Filtering', reset: false do
  before_collection_count = 0
  after_collection_count = 0

  before :all do
    Capybara.reset_sessions!
    load_page :search, env: :sit, facets: true
    login
  end

  after :all do
    Capybara.reset_sessions!
  end

  context "when the collection list is loaded" do
    it "the CWIC feature appears in the facets panel", acceptance: true do
      expect(cwic_feature_facet).to have_content("Int'l / Interagency")
    end

    it "the CWIC feature is de-selected by default", acceptance: true do
      expect(cwic_feature_facet).to have_no_css('.fa-check-square-o')
    end
  end

  context 'selecting the CWIC filter' do
    before :all do
      before_collection_count = collection_results_header.text.match(/\d+ Matching Collections/).to_s.split(" ")[0].to_i
      cwic_feature_facet.click
      wait_for_xhr
    end

    it 'refreshes the collection search to include CWIC-tagged collections', acceptance: true do
      after_collection_count = collection_results_header.text.match(/\d+ Matching Collections/).to_s.split(" ")[0].to_i
      expect(before_collection_count).to be < after_collection_count
    end

    it "has its selection state indicated in the UI", acceptance: true do
      expect(cwic_feature_facet).to have_css('.fa-check-square-o')
    end

    it "has its selection state saved in the URL", acceptance: true do
      expect(page).to have_query_string("echo_env=testbed&ff=Int'l+%2F+Interagency")
    end

    context 'and de-selecting the CWIC filter' do
      before :all do
        cwic_feature_facet.click
        wait_for_xhr
      end

      it 'refreshes the collection search to exclude CWIC-tagged collections', acceptance: true do
        after_collection_count = collection_results_header.text.match(/\d+ Matching Collections/).to_s.split(" ")[0].to_i
        expect(after_collection_count).to eq(before_collection_count)
      end

      it 'has its selection state indicated in the UI', acceptance: true do
        expect(cwic_feature_facet).to have_no_css('.fa-check-square-o')
      end

      it 'removes its selection state from the URL', acceptance: true do
        expect(page).to have_query_string("echo_env=testbed")
      end
    end
  end

  context "restoring a search from a URL parameter" do
    before :all do
      load_page :search, env: :sit, facets: true
      login
      wait_for_xhr
      before_collection_count = collection_results_header.text.match(/\d+ Matching Collections/).to_s.split(" ")[0].to_i
      load_page :search, env: :sit, facets: true, ff: "Int'l / Interagency"
      login
      wait_for_xhr
      after_collection_count = collection_results_header.text.match(/\d+ Matching Collections/).to_s.split(" ")[0].to_i
    end

    after :all do
      load_page :search, env: :sit, facets: true
    end

    it 'includes CWIC-tagged collections in search results', acceptance: true do
      expect(before_collection_count).to be < after_collection_count
    end

    it 'has its selection state indicated in the UI', acceptance: true do
      expect(cwic_feature_facet).to have_css('.fa-check-square-o')
    end
  end

end
