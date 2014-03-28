# EDSC-102 As a user, I want to view my contact information
# so that I may verify it is correct

require 'spec_helper'

describe 'Contact Information', reset: false do
  before :all do
    Capybara.reset_sessions!
    visit '/search'
    login

    click_link 'edsc'
    # TODO: Both of these fail to get me to the contact info page
    # click_link 'Contact Information'
    # click_contact_information
    visit '/contact_info'
    wait_for_xhr
  end

  it "shows the user the current contact information" do
    expect(page).to have_field("First name", with: "Earthdata")
    expect(page).to have_field("Last name", with: "Search")
    expect(page).to have_field("Email", with: "patrick+edsc@element84.com")
    expect(page).to have_field("Organization name", with: "EDSC")
    expect(page).to have_field("Phone number", with: "555-555-5555")
    expect(page).to have_field("Fax number", with: "555-555-6666")
    expect(page).to have_field("Street", with: "101 N. Columbus St.")
    expect(page).to have_field("street2", with: "Suite 200")
    expect(page).to have_field("street3", with: "")
    expect(page).to have_select("Country", selected: "United States")
    expect(page).to have_select("State", selected: "VA")
    expect(page).to have_field("Zip", with: "22314")
    expect(page).to have_select("Receive delayed access notifications", selected: "Never")
  end
end
