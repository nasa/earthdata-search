require 'spec_helper'

describe 'Data Center Query Param', reset: false do
  before :all do
    visit '/search?echo_env=testbed&fdc=AAFC'
  end

  it "returns collections from the provided data center" do
    expect(page).to have_content("AAFC 10")
    expect(page).to have_content("10 Matching Collections")
  end

  it "does not return collections from other archive centers" do
    expect(page).to have_no_content("LAADS")
  end
end
