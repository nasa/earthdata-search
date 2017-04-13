require 'spec_helper'

describe "Expired user token", reset: true do
  after :each do
    page.set_rack_session(expires_in: nil)
    page.set_rack_session(access_token: nil)
    page.set_rack_session(refresh_token: nil)
  end

  context "Successful refreshing" do
    let(:return_json) {urs_tokens['edsc']}
    let(:access_token) {return_json['access_token']}

    before :each do
      Capybara.reset_sessions!

      Echo::Client.any_instance.stub(:refresh_token).and_return(OpenStruct.new(body: return_json))
    end

    context 'when loading the page with an expired token' do
      before :each do
        #login without loading a page first
        be_logged_in_as 'expired_token'

        load_page :root
      end

      it "refreshes the token" do
        expect(page.get_rack_session_key('access_token')).to eql(access_token)
      end
    end

    context 'when calling an ajax request with an expired token' do
      before :each do
        #login without loading a page first
        be_logged_in_as 'expired_token'
        page.set_rack_session(expires_in: 500)

        load_page :root
        wait_for_xhr

        script = "window.tokenExpiresIn = -1;"
        page.execute_script script

        fill_in 'keywords', with: 'AST_L1AE'
        wait_for_xhr
      end

      it 'refreshes the token' do
        expect(page).to have_content('ASTER Expedited L1A')
        expect(page.get_rack_session_key('expires_in')).to eql(3600)
        expect(page.get_rack_session_key('access_token')).to eql(access_token)
      end
    end
  end

  context "Unsuccessful refreshing" do
    let(:return_json) {nil}

    before :each do
      Capybara.reset_sessions!

      Echo::Client.any_instance.stub(:refresh_token).and_return(OpenStruct.new(body: return_json))
    end

    context 'when loading the page with an expired token' do
      before :each do
        #login without loading a page first
        be_logged_in_as 'expired_token'
        page.set_rack_session(refresh_token: 'invalid')

        load_page :root
      end

      it "sends the user to login" do
        expect(page).to have_content "EOSDIS Earthdata Login"
      end
    end

    context 'when calling an ajax request with an expired token' do
      before :each do
        #login without loading a page first
        be_logged_in_as 'expired_token'
        page.set_rack_session(expires_in: 500)
        page.set_rack_session(refresh_token: 'invalid')

        load_page :root
        wait_for_xhr

        script = "window.tokenExpiresIn = -1;"
        page.execute_script script

        fill_in 'keywords', with: 'AST_L1AE'
        wait_for_xhr
      end

      it 'refreshes the token' do
        expect(page).to have_content "EOSDIS Earthdata Login"
      end
    end
  end
end
