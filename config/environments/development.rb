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

  config.logo_name = "dev-logo-beta"
  config.env_name = "[DEV]"
  # SIT Tophat
  config.tophat_url = "https://cdn.uat.earthdata.nasa.gov/tophat/tophat.js"
  config.feedback_url = 'https://fbm.uat.earthdata.nasa.gov/for/EdSearch_SIT/feedback.js'

  config.url_limit = 200

  config.cmr_client_id = ENV['cmr_client_id'] || 'edsc-dev'
end
