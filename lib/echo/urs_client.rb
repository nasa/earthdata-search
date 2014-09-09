module Echo
  class UrsClient < BaseClient
    def urs_login_path(callback_url=ENV['urs_callback_url'])
      "#{@root}/oauth/authorize?client_id=#{@client_id}&redirect_uri=#{callback_url}&response_type=code"
    end

    def get_oauth_tokens(auth_code, callback_url=ENV['urs_callback_url'])
      Echo::Response.new(connection.post("/oauth/token?grant_type=authorization_code&code=#{auth_code}&redirect_uri=#{callback_url}"))
    end

    def refresh_token(refresh_token)
      Echo::Response.new(connection.post("/oauth/token?grant_type=refresh_token&refresh_token=#{refresh_token}"))
    end

    protected

    def build_connection
      super.tap do |conn|
        conn.basic_auth(ENV['urs_username'], ENV['urs_password'])
        conn.request :json
      end
    end
  end
end
