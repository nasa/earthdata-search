class ApplicationController < ActionController::Base
  include AuthenticationUtils
  include ClientUtils

  protect_from_forgery

  before_action :refresh_urs_if_needed, except: [:logout, :refresh_token]
  before_action :validate_portal
  before_action :migrate_user_data

  # As of EDSC-2057 we are storing profile and preference information for the user in the
  # database instead of storing parts of it in the session and continually asking for it.
  # This method looks for a key that we previously stored in the session and uses it's value
  # to pull and store the information we now retrieve when a user logs in. This method will
  # ensure that users that were logged in before the deployment don't experience any issues.
  def migrate_user_data
    if logged_in? && session.key?(:user_name) && session[:user_name]
      # Mocks the response from URS providing only the necessary keys to store the user data
      store_user_data('endpoint' => "/api/users/#{session[:user_name]}")

      # Remove this old value from the session
      session.delete(:user_name)
    end
  end

  rescue_from Faraday::Error::TimeoutError, with: :handle_timeout
  rescue_from Faraday::Error::ConnectionFailed, with: :handle_connection_failed

  def redirect_from_urs
    last_point = session[:last_point]
    session[:last_point] = nil
    last_point || edsc_path(root_url)
  end

  protected

  def set_env_session
    session[:cmr_env] = nil
    session[:cmr_env] = cmr_env
  end

  def refresh_urs_if_needed
    current_user
    refresh_urs_token if logged_in? && server_session_expires_in < 0
  end

  def refresh_urs_token
    json = echo_client.refresh_token(session[:refresh_token]).body
    store_oauth_token(json)

    if json.nil? && !request.xhr?
      session[:last_point] = request.fullpath

      redirect_to echo_client.urs_login_path
    end

    json
  end

  def handle_timeout
    render json: { errors: { error: 'The server took too long to complete the request' } }, status: :gateway_timeout if request.xhr?
  end

  def handle_connection_failed
    render json: { errors: { error: 'Faraday::Error::ConnectionFailed: Likely SSL Certificate Failure' } }, status: :internal_server_error
  end

  def token
    session[:access_token]
  end

  def get_user_id
    return nil if token.blank?

    # Work around a problem where logging into sit from the test environment goes haywire
    # because of the way tokens are set up
    return 'edsc' if Rails.env.test? && cmr_env != 'prod'

    session[:echo_id]
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

  def clear_session
    store_oauth_token
  end

  def store_oauth_token(json = {})
    json ||= {}

    session[:access_token]  = json['access_token']
    session[:refresh_token] = json['refresh_token']
    session[:expires_in]    = json['expires_in']
    session[:logged_in_at]  = json.empty? ? nil : Time.now.to_i
  end

  def logged_in_at
    session[:logged_in_at].nil? ? 0 : session[:logged_in_at]
  end

  def expires_in
    (logged_in_at + session[:expires_in]) - Time.now.to_i
  end

  def require_login
    unless get_user_id
      session[:last_point] = edsc_path(request.fullpath)

      redirect_to echo_client.urs_login_path
    end
  end

  # Seconds ahead of the token expiration that the server and scripts should
  # attempt to refresh their token respectively
  SERVER_EXPIRATION_OFFSET_S = 60
  SCRIPT_EXPIRATION_OFFSET_S = 300

  def logged_in?
    logged_in = session[:access_token].present? &&
                session[:refresh_token].present? &&
                session[:expires_in].present? &&
                session[:logged_in_at].present?

    if Rails.env.development?
      Rails.logger.info "Access: #{session[:access_token]}"
      Rails.logger.info "Refresh: #{session[:refresh_token]}"
    end

    store_oauth_token() unless logged_in
    logged_in
  end
  helper_method :logged_in?

  # Tokens are not necessary for creating/updating EDSC objects which is all that
  # happens via JSON so we're not going to require the user to be authenticated here
  # (This would also require the user be authenticated on the search page, which is undesireable)
  def json_request?
    request.format.json?
  end

  def server_session_expires_in
    logged_in? ? (expires_in - SERVER_EXPIRATION_OFFSET_S).to_i : 0
  end

  def script_session_expires_in
    logged_in? ? 1000 * (expires_in - SCRIPT_EXPIRATION_OFFSET_S).to_i : 0
  end
  helper_method :script_session_expires_in

  def portal_id
    return @portal_id if @portal_id
    portal_id = params[:portal].presence
    portal_id = portal_id.downcase unless portal_id.nil?
    @portal_id = portal_id
  end
  helper_method :portal_id

  def portal
    Rails.configuration.portals[portal_id] || {} if portal?
  end
  helper_method :portal

  def portal_scripts
    (portal? && portal[:scripts]) || []
  end
  helper_method :portal_scripts

  def portal?
    portal_id.present? && Rails.configuration.portals.key?(portal_id)
  end
  helper_method :portal?

  def validate_portal
    if portal_id.present? && !Rails.configuration.portals.key?(portal_id)
      raise ActionController::RoutingError.new("Portal \"#{portal_id}\" not found")
    end
  end

  def edsc_path(path)
    if portal?
      id = URI.encode(portal_id)
      if path.start_with?('http')
        # Full URL
        path = path.gsub(/^[^\/]*\/\/[^\/]*/, "\0/portal/#{id}")
      elsif path.start_with?('/')
        # Absolute
        path = "/portal/#{id}" + path
      end
    end
    path
  end
  helper_method :edsc_path

  def metrics_event(type, data, other_data={})
    Rails.logger.tagged('metrics') do
      timestamp = (Time.now.to_f * 1000).to_i
      Rails.logger.info({event: type, data: data, session: session.id, timestamp: timestamp}.merge(other_data).to_json)
    end
  end

  def log_execution_time
    time = Benchmark.realtime do
      yield
    end

    if params[:controller] == 'collections' && params[:action] == 'index'
      action = 'search'
    elsif params[:controller] == 'granules' && params[:action] == 'create'
      action = 'index'
    else
      action = params[:action]
    end
    Rails.logger.info "#{params[:controller].singularize}##{action} request took #{(time.to_f * 1000).round(0)} ms"
  end
end
