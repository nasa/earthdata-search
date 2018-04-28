EarthdataSearchClient::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  config.eager_load = false

  config.assets.digest = true

  config.assets.prefix = "/assets-dev"

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log

  # Expands the lines which load the assets
  config.assets.debug = true

  if ENV['offline'] == 'true'
    VCR.configure { |c| VCR::EDSCConfigurer.configure(c, record: :none) }
  end

  config.logo_name = "DEV"
  config.env_name = "[DEV]"
  # UAT Tophat
  config.tophat_url = "https://cdn.uat.earthdata.nasa.gov/tophat2/tophat2.js"
  config.feedback_url = 'https://fbm.earthdata.nasa.gov/for/EDSC-SIT/feedback.js'

  config.url_limit = 500
  config.cmr_env = 'sit'

  # This is also the client ID sent to OpenSearch. It is kept the same since the OpenSearch endpoint ultimately
  # talks to ECHO/CMR.
  config.cmr_client_id = ENV['cmr_client_id'] || 'edsc-dev'
end
