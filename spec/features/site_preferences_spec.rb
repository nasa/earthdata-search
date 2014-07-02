# EDSC-105: As a user, I want to save my site-viewing preferences
#           so that I may customize my experience with the site
# EDSC-138: As a user, I want the system to remember when I dismiss
#           the introductory tour so that it does not interfere with
#           subsequent visits

require 'spec_helper'

describe 'Site Preferences', reset: true do
  after :each do
    wait_for_xhr
    User.destroy_all if page.server.responsive?
  end

  before :each do
    load_page :root
  end

  context "when user is logged in" do
    before :each do
      login
    end

    it "shows the tour" do
      expect(page).to have_css '.tour'
    end

    it "sets site preferences when closing the tour" do
      click_button 'End Tour'
      click_button 'Close'
      expect(page).to have_no_css '.tour'
      wait_for_xhr

      load_page :root
      expect(page).to have_no_css '.tour'
    end

    it "shows Take a Tour link after closing the tour" do
      click_button 'End Tour'
      expect(page).to have_content 'Take a Tour'
    end
  end

  context "when user is a guest" do
    it "shows the tour" do
      expect(page).to have_css '.tour'
    end

    it "sets site preferences when closing the tour" do
      click_button 'End Tour'
      click_button 'Close'
      expect(page).to have_no_css '.tour'
      wait_for_xhr

      load_page :root
      expect(page).to have_no_css '.tour'
    end

    it "shows Take a Tour link after closing the tour" do
      click_button 'End Tour'
      expect(page).to have_content 'Take a Tour'
    end
  end
end
