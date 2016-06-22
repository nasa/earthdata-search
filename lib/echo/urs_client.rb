module Echo
  class UrsClient < BaseClient
    def get_urs_availability
      connection.get("/")
    end

    def urs_login_path(callback_url=ENV['urs_callback_url'])
      "#{@root}/oauth/authorize?client_id=#{@urs_client_id}&redirect_uri=#{callback_url}&response_type=code"
    end

    def get_oauth_tokens(auth_code, callback_url=ENV['urs_callback_url'])
      Echo::Response.new(connection.post("/oauth/token?grant_type=authorization_code&code=#{auth_code}&redirect_uri=#{callback_url}"))
    end

    def refresh_token(refresh_token)
      Echo::Response.new(connection.post("/oauth/token?grant_type=refresh_token&refresh_token=#{refresh_token}"))
    end

    def get_urs_user(user_name, access_token)
      get("/api/users/#{user_name}?client_id=#{@urs_client_id}", nil, {'AUTHORIZATION' => "Bearer #{access_token}"})
    end

    protected

    def build_connection
      super do |conn|
        conn.basic_auth(ENV['urs_username'], ENV['urs_password'])
        conn.request :json
      end
    end
  end
end
