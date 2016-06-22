class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter :refresh_urs_if_needed, except: [:logout, :refresh_token]
  before_filter :validate_portal

  rescue_from Faraday::Error::TimeoutError, with: :handle_timeout

  def redirect_from_urs
    last_point = session[:last_point]
    session[:last_point] = nil
    last_point || edsc_path(root_url)
  end


  # DELETE ME: Portal debug
  #before_filter :refresh_portals
  #def refresh_portals
  #  if Rails.env.development?
  #    portals = YAML.load_file(Rails.root.join('config/portals.yml'))
  #    Rails.configuration.portals = (portals[Rails.env.to_s] || portals['defaults']).with_indifferent_access
  #    Rails.logger.info "REFRESH -> #{Rails.configuration.portals}.inspect"
  #  end
  #end

  protected

  RECENT_DATASET_COUNT = 2

  def echo_client
    if @echo_client.nil?
      service_configs = Rails.configuration.services
      @echo_client = Echo::Client.client_for_environment(cmr_env, Rails.configuration.services)
    end
    @echo_client
  end

  def cmr_env
    @cmr_env = session[:cmr_env] unless session[:cmr_env].nil?
    @cmr_env ||= request.headers['edsc-echo-env'] || request.query_parameters['cmr_env']
    if request.query_parameters['cmr_env'] && !(['sit', 'uat', 'prod', 'ops'].include? request.query_parameters['cmr_env'])
      @cmr_env = Rails.configuration.cmr_env
    else
      @cmr_env ||= Rails.configuration.cmr_env || 'prod'
    end
    @cmr_env = 'prod' if @cmr_env == 'ops'
    @cmr_env
  end
  helper_method :cmr_env

  def set_env_session
    session[:cmr_env] = nil
    session[:cmr_env] = cmr_env
  end

  def refresh_urs_if_needed
    if logged_in? && server_session_expires_in < 0
      refresh_urs_token
    end
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

    # Work around a problem where logging into sit from the test environment goes haywire
    # because of the way tokens are set up
    return 'edsc' if Rails.env.test? && cmr_env != 'prod'

    response = echo_client.get_current_user(token).body
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
  def use_collection(id)
    return false if id.blank? || (Rails.env.test? && cookies['persist'] != 'true')

    id = id.first if id.is_a? Array
    if current_user.present?
      @@recent_lock.synchronize do
        RecentCollection.find_or_create_by(user: current_user, echo_id: id).touch
      end
    else
      # FIXME This does not work for guests loading directly to a project with more then 1
      # collection, the session gets session does not carry over between the multiple calls to
      # collections_controller:show
      recent = session[:recent_collections] || []
      recent.unshift(id)
      session[:recent_collections] = recent.uniq.take(RECENT_DATASET_COUNT)
    end
    true
  end

  def earthdata_username
    session[:user_name]
  end

  def clear_session
    store_oauth_token()
    session[:user_id] = nil
    session[:user_name] = nil
    session[:recent_collections] = []
  end

  def store_oauth_token(json={})
    json ||= {}
    session[:access_token] = json["access_token"]
    session[:refresh_token] = json["refresh_token"]
    session[:expires_in] = json["expires_in"]
    session[:user_name] = json['endpoint'].gsub('/api/users/', '') if json['endpoint']
    session[:logged_in_at] = json.empty? ? nil : Time.now.to_i
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
                session[:logged_in_at]
    if Rails.env.development?
      Rails.logger.info "Access: #{session[:access_token]}"
      Rails.logger.info "Refresh: #{session[:refresh_token]}"
    end
    store_oauth_token() unless logged_in
    logged_in
  end
  helper_method :logged_in?

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

end
