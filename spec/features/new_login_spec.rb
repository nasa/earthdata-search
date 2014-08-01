require 'spec_helper'

describe 'junk' do
  it "should work" do
    #
    json = JSON.parse('{"access_token":"45958d693b04fd075d65bff6f755535d497ef29a070e31061b9f4eea2292b255","token_type":"Bearer","expires_in":3600,"refresh_token":"1d771457e10ab3695d3ee10b1e2cf1b0d1476a346ec94a16398ef1041c58b8fe","endpoint":"/api/users/macrouch","username":"macrouch","expires":1406914709}')

    page.set_rack_session(:username => 'macrouch')
    page.set_rack_session(:expires => '1406914709')
    page.set_rack_session(:expires_in => '3600')
    page.set_rack_session(:endpoint => '/api/users/macrouch')
    page.set_rack_session(:expires => '1406914709')
    page.set_rack_session(:access_token => '45958d693b04fd075d65bff6f755535d497ef29a070e31061b9f4eea2292b255')
    page.set_rack_session(:refresh_token => '1d771457e10ab3695d3ee10b1e2cf1b0d1476a346ec94a16398ef1041c58b8fe')
    page.set_rack_session(:urs_user => json)

    visit '/search'

    expect(page).to have_no_content('URS')
    expect(page).to have_content('15 Minute')
  end
end
