module ClientUtils
  extend ActiveSupport::Concern

  included do
    helper_method :echo_client, :ous_client, :cmr_env
  end

  def echo_client
    if @echo_client.nil?
      @echo_client = Echo::Client.client_for_environment(cmr_env, Rails.configuration.services)
    end

    @echo_client
  end

  def ous_client
    if @ous_client.nil?
      @ous_client = Ous::Client.client_for_environment(cmr_env, Rails.configuration.services)
    end

    @ous_client
  end

  def cmr_env
    # Check to see if an environment was specificed in a session variable
    @cmr_env = session[:cmr_env] unless session[:cmr_env].nil?
    
    # Next, and higher priority, check for a parameter sent in a hearer or within query params
    @cmr_env ||= request.headers['edsc-echo-env'] || request.query_parameters['cmr_env']
    if request.query_parameters['cmr_env'] && !(['sit', 'uat', 'prod', 'ops'].include? request.query_parameters['cmr_env'])
      @cmr_env = Rails.configuration.cmr_env
    else
      @cmr_env ||= Rails.configuration.cmr_env || 'prod'
    end

    @cmr_env = 'prod' if @cmr_env == 'ops'
    @cmr_env
  end
end
