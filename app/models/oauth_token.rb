require 'uri'

class OauthToken
  def self.get_oauth_tokens(auth_code)
    uri = URI.parse("#{ ENV['urs_root'] }oauth/token?grant_type=authorization_code&code=#{ auth_code }&redirect_uri=#{ENV['urs_callback_url']}")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == "https"
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Post.new(uri.request_uri)
    request.basic_auth(ENV['urs_username'],ENV['urs_password'])
    request.set_form_data({})

    response = http.request(request)

    json = JSON.parse(response.body)
    json['username'] = json['endpoint'].sub('/api/users/', '')
    json['expires'] = (Time.now + json['expires_in']).to_i
    json
  end

  def self.refresh_token(refresh_token)
    uri = URI.parse("#{ ENV['urs_root'] }oauth/token?grant_type=refresh_token&refresh_token=#{ refresh_token }")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == "https"
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Post.new(uri.request_uri)
    request.basic_auth(ENV['urs_username'],ENV['urs_password'])
    request.set_form_data({})

    response = http.request(request)

    json = JSON.parse(response.body)
    if json['access_token']
      json['username'] = json['endpoint'].sub('/api/users/', '')
      json['expires'] = (Time.now + json['expires_in']).to_i
      json
    else
      false
    end
  end

end
