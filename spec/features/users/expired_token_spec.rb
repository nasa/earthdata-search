require 'spec_helper'

describe "Expired user token", reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search

    within ".banner" do |variable|
      click_link "close"
      click_link "close"
    end

    login
  end

  context "when searching for datasets with an expired token" do
    before :all do
      fill_in "keywords", with: "fail hard"
      wait_for_xhr
    end

    it "logs the user out" do
      expect(page).to have_content "Sign In"
    end

    it "displays banner" do
      expect(page).to have_content "Session has ended Please sign in"
    end
  end
end
