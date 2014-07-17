require 'uri'

class OauthToken
  def self.get_oauth_tokens(auth_code)
    uri = URI.parse("#{ Rails.application.secrets.urs_root }oauth/token?grant_type=authorization_code&code=#{ auth_code }&redirect_uri=#{Rails.application.secrets.urs_callback_url}")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == "https"
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Post.new(uri.request_uri)
    request.basic_auth(Rails.application.secrets.urs_username, Rails.application.secrets.urs_password)
    request.set_form_data({})

    response = http.request(request)

    json = JSON.parse(response.body)
    json['username'] = json['endpoint'].sub('/api/users/', '')
    json
  end

  def self.refresh_token(refresh_token)
    puts refresh_token.inspect

    uri = URI.parse("#{ Rails.application.secrets.urs_root }oauth/token?grant_type=refresh_token&refresh_token=#{ refresh_token }")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == "https"
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Post.new(uri.request_uri)
    request.basic_auth(Rails.application.secrets.urs_username, Rails.application.secrets.urs_password)
    request.set_form_data({})

    response = http.request(request)

    json = JSON.parse(response.body)
    puts "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    puts response.inspect
    if json
      json['username'] = json['endpoint'].sub('/api/users/', '')
      session[:urs_user] = json
    end
  end

end
