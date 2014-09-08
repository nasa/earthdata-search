require 'spec_helper'

describe OauthTokensController, type: :controller do
  describe 'GET refresh_token' do
    it 'updates the session with a new token' do
      session[:access_token] = 'old_access_token'
      session[:refresh_token] = 'old_refresh_token'
      session[:expires_in] = '1'

      expected = {'tokenExpiresIn' => 3300000}
      return_json = {'expires_in' => 3600, 'access_token' => 'new_access_token', 'refresh_token' => 'new_refresh_token'}

      mock_client = Object.new
      expect(Echo::Client).to receive('client_for_environment').and_return(mock_client)
      allow(mock_client).to receive(:refresh_token).and_return(OpenStruct.new('success?' => true, 'body' => return_json))

      get :refresh_token
      expect(JSON.parse(response.body)).to eql(expected)
      expect(session[:access_token]).to eql('new_access_token')
      expect(session[:refresh_token]).to eql('new_refresh_token')
    end
  end
end
