class OfflineTemplate < AbstractController::Base
  # Include all the concerns we need to make this work
  include AbstractController::Logger
  include AbstractController::Rendering
  include ActionView::Layouts
  include AbstractController::Helpers
  include AbstractController::Translation
  include AbstractController::AssetPaths
  include ActionController::UrlFor
  include Rails.application.routes.url_helpers

  # this is you normal rails application helper
  helper ApplicationHelper
  helper PortalHelper

  # Define additional helpers
  helper_method :protect_against_forgery?
  helper_method :logged_in?
  helper_method :cmr_env
  helper_method :portal?
  helper_method :portal_id
  helper_method :portal_scripts

  # override the layout in your subclass if needed.
  layout 'application'

  # configure the different paths correctly
  def initialize(*args)
    lookup_context.view_paths = Rails.root.join('app', 'views')
    config.relative_url_root = "."
  end

  # we are not in a browser, no need for this
  def protect_against_forgery?
    false
  end

  # so that your flash calls still work
  def flash
    {}
  end

  def params
    {}
  end

  # same asset host as the controllers
  self.asset_host = ActionController::Base.asset_host

  #def asset_path(*args)
  #  puts "asset_path(#{args.join(', ').map(&:inspect)})"
  #end

  # and nil request to differentiate between live and offline
  def request
    OpenStruct.new(variant: nil)
  end

  def logged_in?
    false
  end

  def cmr_env
    ''
  end

  def controller_name
    'offline'
  end

  def env
    'development'
  end

  def portal?
    false
  end

  def portal_id
    false
  end

  def portal_scripts
    []
  end

  # AbstractController expects response_body, but application.html.erb uses response instead
  def response
    response_body
  end
end
