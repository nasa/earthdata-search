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
    supported_envs = %w(sit uat prod ops)

    # Highest priority, check for a parameter sent in a header or within query params
    cmr_environment = request.headers['edsc-echo-env']
    cmr_environment ||= request.query_parameters['cmr_env']

    # Check to see if an environment was specified in a session variable
    cmr_environment ||= session[:cmr_env] unless session[:cmr_env].nil?

    if request.query_parameters['cmr_env'] && !(supported_envs.include?(request.query_parameters['cmr_env']))
      cmr_environment = Rails.configuration.cmr_env
    else
      cmr_environment ||= Rails.configuration.cmr_env || 'prod'
    end

    cmr_environment = 'prod' if cmr_environment == 'ops'

    cmr_environment
  end
end
