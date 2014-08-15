require 'spec_helper'

describe "Expired user token", reset: true do

  return_json = JSON.parse(ENV['urs_tokens'])['edsc']

  before :each do
    Capybara.reset_sessions!

    allow(OauthToken).to receive(:refresh_token).and_return(return_json)
  end

  after :each do
    page.set_rack_session(username: nil)
    page.set_rack_session(expires: nil)
    page.set_rack_session(expires_in: nil)
    page.set_rack_session(endpoint: nil)
    page.set_rack_session(access_token: nil)
    page.set_rack_session(refresh_token: nil)
    page.set_rack_session(urs_user: nil)
  end

  context 'when loading the page with an expired token' do
    before :each do
      #login without loading a page first
      be_logged_in_as 'expired_token'

      load_page :root
    end

    it "refreshes the token" do
      expect(page.get_rack_session_key('urs_user')).to eql(return_json)
    end
  end

  context 'when calling an ajax request with an expired token' do
    before :each do
      #login without loading a page first
      be_logged_in_as 'expired_token'
      page.set_rack_session(expires: Time.now.to_i + 1)

      load_page :root
      wait_for_xhr

      fill_in 'keywords', with: 'AST_L1AE'
      click_link 'Browse All Data'
      wait_for_xhr
    end

    it 'refreshes the token' do
      expect(page).to have_content('ASTER Expedited L1A')
      expect(page.get_rack_session_key('urs_user')).to eql(return_json)
    end
  end
end
