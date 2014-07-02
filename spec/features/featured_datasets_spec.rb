require "spec_helper"

describe "Featured datasets", reset: false do
  before :all do
    load_page :search
  end

  context "when no dataset filters have been applied" do
    it "shows featured datasets" do
      expect(featured_dataset_results).to have_content('MOD04_L2')
      expect(featured_dataset_results).to have_content('MOD10_L2')
    end

    it "shows a section heading for featured datasets" do
      expect(dataset_results).to have_content('Featured Datasets')
    end

    it "shows a section heading for other datasets" do
      expect(dataset_results).to have_content('More Datasets')
    end
  end

  context "when dataset filters have been applied which filter some featured datasets" do
    before :all do
      fill_in "keywords", with: "snow cover nrt"
      wait_for_xhr
    end

    after :all do
      click_on "Clear Filters"
      wait_for_xhr
    end

    it "shows featured datasets matching the filters" do
      expect(featured_dataset_results).to have_content('MOD10_L2')
    end

    it "hides featured datasets not matching the filters" do
      expect(featured_dataset_results).to have_no_content('MOD04_L2')
    end

    it "shows a section heading for featured datasets" do
      expect(dataset_results).to have_content('Featured Datasets')
    end

    it "shows a section heading for other datasets" do
      expect(dataset_results).to have_content('More Datasets')
    end
  end

  context "when dataset filters have been applied which filter all featured datasets" do
    before :all do
      fill_in "keywords", with: "AST"
      wait_for_xhr
    end

    after :all do
      click_on "Clear Filters"
      wait_for_xhr
    end

    it "shows no featured datasets" do
      expect(page).to have_no_content('MOD04_L2')
      expect(page).to have_no_content('MOD10_L2')
    end

    it "shows no section heading for featured datasets" do
      expect(dataset_results).to have_no_content('Featured Datasets')
    end

    it "shows no section heading for other datasets" do
      expect(dataset_results).to have_no_content('More Datasets')
    end
  end
end
