require 'uri'
require 'net/http'
require 'net/https'

class OauthToken
  def self.get_oauth_tokens(auth_code)
    urs_post "/oauth/token?grant_type=authorization_code&code=#{auth_code}&redirect_uri=#{ENV['urs_callback_url']}"
  end

  def self.refresh_token(refresh_token)
    urs_post "/oauth/token?grant_type=refresh_token&refresh_token=#{refresh_token}"
  end

  private

  def self.urs_post(path)
    response = connection.post path
    response.body if response.success?
  end

  def self.connection
    Thread.current[:edsc_urs_connection] ||= self.build_connection
  end

  def self.build_connection
    connection = Faraday.new(ENV['urs_root'].chomp('/'))
    connection.basic_auth(ENV['urs_username'], ENV['urs_password'])
    connection.request :json
    connection.response :json, :content_type => /\bjson$/
    connection
  end
end
