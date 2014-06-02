# EDSC-102 As a user, I want to view my contact information
# so that I may verify it is correct

require 'spec_helper'

describe 'Contact Information', reset: false do
  before :all do
    load_page :search, overlay: false
    login

    click_link 'Manage user account'
    # TODO: Both of these fail to get me to the contact info page
    # click_link 'Contact Information'
    # click_contact_information
    visit '/contact_info'
    wait_for_xhr
  end

  it "shows the current user's contact information" do
    expect(page).to have_field("First name", with: "Earthdata")
    expect(page).to have_field("Last name", with: "Search")
    expect(page).to have_field("Email", with: "patrick+edsc@element84.com")
    expect(page).to have_field("Organization name", with: "EDSC")
    expect(page).to have_field("Phone number", with: "555-555-5555")
    expect(page).to have_field("Fax number", with: "555-555-6666")
    expect(page).to have_field("Street", with: "101 N. Columbus St.")
    expect(page).to have_field("address_street2", with: "Suite 200")
    expect(page).to have_field("address_street3", with: "")
    expect(page).to have_select("Country", selected: "United States")
    expect(page).to have_select("State", selected: "VA")
    expect(page).to have_field("Zip", with: "22314")
    expect(page).to have_select("Receive delayed access notifications", selected: "Never")
  end

  context "filling in valid changes and submitting" do
    before :all do
      fill_in "First name", with: "Edsc"
      fill_in "Phone number", with: "555-444-4444"
      fill_in "Street", with: "101 North Columbus St."
      click_on "Update Information"
      wait_for_xhr
    end

    after :all do
      fill_in "First name", with: "Earthdata"
      fill_in "Phone number", with: "555-555-5555"
      fill_in "Street", with: "101 N. Columbus St."
      click_on "Update Information"
      wait_for_xhr
    end

    it "persists the changes" do
      expect(page).to have_field("First name", with: "Edsc")
      # I'm not convinced this is possible to test in a meaningful way with VCR
      # due to its statefulness
      #visit '/contact_info'
      #wait_for_xhr
      #expect(page).to have_field("First name", with: "Edsc")
    end

    it "displays a confirmation message" do
      expect(page).to have_text('Successfully updated contact information')
    end
  end

  context "submitting with missing required fields" do
    before :each do
      fill_in "First name", with: ""
      click_on "Update Information"
    end

    after :each do
      visit '/contact_info'
      wait_for_xhr
    end

    it "rejects the updates" do
      visit '/contact_info'
      wait_for_xhr
      expect(page).to have_field('First name', with: 'Earthdata')
    end

    it "displays appropriate error messages" do
      expect(page).to have_text('Please fill in all required fields, highlighted below')
    end
  end
end
