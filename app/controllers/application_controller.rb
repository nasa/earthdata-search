class ApplicationController < ActionController::Base
  protect_from_forgery

  rescue_from Faraday::Error::TimeoutError, with: :handle_timeout

  protected

  RECENT_DATASET_COUNT = 2

  def handle_timeout
    Rails.logger.error 'Request timed out'
    if request.xhr?
      render json: {errors: {error: 'The server took too long to complete the request'}}, status: 504
    end
  end

  def token
    cookies['token']
  end

  def get_user_id
    # Dont make a call to ECHO if we already know the user id
    return session[:user_id] if session[:user_id]

    # Dont make a call to ECHO if user is not logged in
    return nil unless token.present?

    response = Echo::Client.get_token_info(token).body
    session[:user_id] = response["token_info"]["user_guid"] if response["token_info"]
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

    if current_user.present?
      id = id.first if id.is_a? Array
      @@recent_lock.synchronize do
        RecentDataset.find_or_create_by(user: current_user, echo_id: id).touch
      end
    else
      recent = session[:recent_datasets] || []
      recent.unshift(id)
      session[:recent_datasets] = recent.uniq.take(RECENT_DATASET_COUNT + DatasetExtra.featured_ids.size)
    end
  end

end
