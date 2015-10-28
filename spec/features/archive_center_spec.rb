require 'spec_helper'

describe 'Archive Center Query Param', reset: false do
  before :all do
    visit '/search?ac=ORNL_DAAC'
  end

  it "returns collections from the provided archive center" do
    within '#collection-results .master-overlay-content' do
      expect(page).to have_content("- ORNL_DAAC", count: 20)
    end
  end

  it "does not return collections from other archive centers" do
    expect(page).to have_no_content("LAADS")
  end
end
