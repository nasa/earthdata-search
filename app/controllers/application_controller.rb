class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter :urs_user, except: [:logout, :refresh_token]

  rescue_from Faraday::Error::TimeoutError, with: :handle_timeout

  def redirect_from_urs
    last_point = session[:last_point]
    session[:last_point] = nil
    last_point || root_url
  end

  protected

  RECENT_DATASET_COUNT = 2

  def urs_user

    # puts "!!!!!"
    # puts session[:expires].inspect
    # puts session.inspect
    puts "current time: #{Time.now.to_i}"
    puts "expires time: #{session[:expires].to_i}"
    if session[:expires].to_i > 0 && Time.now.to_i > session[:expires].to_i
      json = OauthToken.refresh_token(session[:refresh_token])
      if json
        3.times do
          puts '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
          puts ''
        end
        clear_session
        session[:urs_user] = json

        session[:access_token] = json["access_token"]
        session[:refresh_token] = json["refresh_token"]
        session[:expires] = json['expires']
        session[:name] = json["username"]
      end
    end

    @urs_user = session[:urs_user]
    # session[:urs_user] = nil
  end

  def handle_timeout
    Rails.logger.error 'Request timed out'
    if request.xhr?
      render json: {errors: {error: 'The server took too long to complete the request'}}, status: 504
    end
  end

  def token
    session[:access_token]
  end

  def get_user_id
    # Dont make a call to ECHO if user is not logged in
    return session[:user_id] = nil unless token.present?

    # Dont make a call to ECHO if we already know the user id
    return session[:user_id] if session[:user_id]

    response = Echo::Client.get_current_user(token).body
    session[:user_id] = response["user"]["id"] if response["user"]
    session[:user_id]
  end

  @@user_lock = Mutex.new
  def current_user
    if @current_user.nil?
      user_id = get_user_id
      if user_id.present?
        @@user_lock.synchronize do
          @current_user = User.find_or_create_by(echo_id: user_id)
        end
      end
    end
    @current_user
  end

  @@recent_lock = Mutex.new
  def use_dataset(id)
    return unless id.present?
    return if Rails.env.test? && cookies['persist'] != 'true'

    id = id.first if id.is_a? Array
    if current_user.present?
      @@recent_lock.synchronize do
        RecentDataset.find_or_create_by(user: current_user, echo_id: id).touch
      end
    else
      recent = session[:recent_datasets] || []
      recent.unshift(id)
      session[:recent_datasets] = recent.uniq.take(RECENT_DATASET_COUNT + DatasetExtra.featured_ids.size)
    end
  end

  def clear_session
    session[:urs_user] = nil
    session[:access_token] = nil
    session[:refresh_token] = nil
    session[:endpoint] = nil
    session[:expires_in] = nil
    session[:expires] = nil
    session[:username] = nil
  end

end
