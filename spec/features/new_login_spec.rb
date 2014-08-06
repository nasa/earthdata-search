require 'spec_helper'

describe 'junk' do
  it "should work" do
    # do real URS login

    # insert real token info into persister
    # username='edsc'
    # json = Rails.application.secrets.urs_tokens[username]

    # if expires is in the past
    #   json = {fake data}
    # JSON.parse("{'access_token':'#{Rails.application.secrets.access_token}','token_type':'Bearer','expires_in':3600,'refresh_token':'#{Rails.application.secrets.refresh_token}','endpoint':'#{Rails.application.secrets.endpoint}','username':'#{Rails.application.secrets.username}','expires':'#{Time.now + 3600}'}")

    # page.set_rack_session(:username => json['username'])
    # page.set_rack_session(:expires => json['expires'])
    # page.set_rack_session(:expires_in => json['expires_in'])
    # page.set_rack_session(:endpoint => json['endpoint'])
    # page.set_rack_session(:access_token => json['access_token'])
    # page.set_rack_session(:refresh_token => json['refresh_token'])
    # page.set_rack_session(:urs_user => json)

    # VCR::EDSCConfigurer.register_token(username, json['access_token'] + ':' + Rails.application.secrets.urs_client_id)

  #   visit '/'
  #   click_link 'URS Sign In'
  #   fill_in "Username", with: 'edsc'
  #   fill_in "Password", with: 'EDSCtest!1'
  #   click_button 'Log in'
  #   Capybara.screenshot_and_open_image
  #   click_button 'Authorize'
  #   Capybara.screenshot_and_open_image
  #
  #   # expect(page).to have_no_content('URS')
  #   expect(page).to have_content('EOSDIS User Registration System')
  end
end
