# EDSC-102 As a user, I want to view my contact information
# so that I may verify it is correct

require 'rails_helper'

describe 'Contact Information' do
  before :all do
    load_page '/contact_info', authenticate: 'edsc'
    wait_for_xhr
  end

  it 'shows the link to edit profile in Earthdata Login' do
    expect(page).to have_link('Edit Profile in Earthdata Login')
  end

  it "shows the current user's contact information" do
    expect(page).to have_content('First Name Earthdata')
    expect(page).to have_content('Last Name Search')
    expect(page).to have_content('Email patrick+edsc@element84.com')
    expect(page).to have_content('Organization Name EDSC')
    expect(page).to have_content('Country United States')
    expect(page).to have_select('notificationLevel', selected: 'Never')
  end

  # This no longer works because we took the contact information retrieval
  # calls out of the tests. Since the tests don't get this information
  # from URS, we can't test updating it.
  context 'clicking Update Notification Preference button', pending_updates: true do
    before :each do
      expect(page).to have_select('notificationLevel', selected: 'Never')
      find('#notificationLevel').find(:xpath, 'option[1]').select_option
      click_button 'Update Notification Preference'
      wait_for_xhr
    end

    after :each do
      find('#notificationLevel').find(:xpath, 'option[5]').select_option
      click_button 'Update Notification Preference'
      wait_for_xhr
      load_page '/contact_info', authenticate: 'edsc'
      wait_for_xhr
    end

    # There are multiple identical GET preferences requests in the hand-edited cassette, which VCR doc says that they
    # "are replayed in sequence" (https://www.relishapp.com/vcr/vcr/v/2-9-3/docs/request-matching/identical-requests-are-replayed-in-sequence)
    # It is however not the case. The test has been passing because of a real issue in updating the preference which is
    # fixed in this commit.
    # Skip it for the moment.
    it 'updates the order notification preference' do
      expect(page).to have_select('notificationLevel', selected: 'Always')
    end

    it 'displays appropriate successful messages' do
      expect(page).to have_text('Successfully updated notification preference')
    end
  end
end
