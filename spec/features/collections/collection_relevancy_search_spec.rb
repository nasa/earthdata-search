require "spec_helper"

describe "Collection results", reset: false do
  before :all do
    load_page :search
  end

  after :each do
    click_on 'Clear Filters'
    wait_for_xhr
  end


end
