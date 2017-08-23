require File.expand_path('../boot', __FILE__)

require 'rails/all'

Bundler.require(:default, Rails.env)

module EarthdataSearchClient
  class Application < Rails::Application
    #Tilt::CoffeeScriptTemplate.default_bare = true

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    config.autoload_paths += Dir["#{config.root}/lib", "#{config.root}/lib/**/"]
    config.eager_load_paths += Dir["#{config.root}/lib", "#{config.root}/lib/**/"]

    config.autoload_paths += Dir["#{config.root}/app/services", "#{config.root}/app/services/**/"]
    config.eager_load_paths += Dir["#{config.root}/app/services", "#{config.root}/app/services/**/"]

    # Only load the plugins named here, in the order given (default is alphabetical).
    # :all can be used as a placeholder for all plugins not explicitly named.
    # config.plugins = [ :exception_notification, :ssl_requirement, :all ]

    # Activate observers that should always be running.
    # config.active_record.observers = :cacher, :garbage_collector, :forum_observer

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :en
    config.i18n.enforce_available_locales = false

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    # Enable escaping HTML in JSON.
    config.active_support.escape_html_entities_in_json = true

    # Use SQL instead of Active Record's schema dumper when creating the database.
    # This is necessary if your schema can't be completely dumped by the schema dumper,
    # like if you have constraints or database-specific column types
    # config.active_record.schema_format = :sql

    # Enable the asset pipeline
    config.assets.enabled = true

    config.is_plugin = Proc.new do |path|
      !%w(.css .map).include?(File.extname(path)) && File.basename(path).start_with?('edsc-plugin.')
    end

    # Precompile application.js, application.css, and any file that's not
    config.assets.precompile += ['application.js', 'application.css', 'splash.css', 'search.js', 'data_access.js', 'account.js']
    config.assets.precompile << Proc.new do |path|
      !%w(.js .css .map).include?(File.extname(path)) ||
        config.is_plugin.call(path) ||
        File.basename(path).start_with?('edsc-portal.') && File.extname(path) == '.js'
    end

    config.log_tags = [:uuid]

    config.middleware.insert(0, Rack::Rewrite) do
      rewrite(%r{^/portal/(\w+)(.*)$}, lambda { |match, rack_env|
        prefix = match[2].start_with?('/') ? '' : '/'
        separator = match[2].include?('?') ? '&' : '?'
        "#{prefix}#{match[2]}#{separator}portal=#{match[1]}"
      })
    end

    # Version of your assets, change this if you want to expire all your assets
    config.assets.version = '1.0'

    # Add FontAwesome to the asset pipeline
    config.assets.paths << Rails.root.join('app', 'assets', 'fonts')

    # node-compiled assets
    config.assets.paths << Rails.root.join('edsc', 'dist')

    # edsc plugins
    config.assets.paths += Dir.glob(Rails.root.join('edsc', '*', 'dist'))
    config.assets.precompile += %w(.svg .eot .woff .woff2 .ttf)
    config.assets.initialize_on_precompile = false

    config.gather_metrics = false

    config.generators do |g|
      # Avoid generating assets for new controllers.  They encourage bad practices.
      g.assets false
    end

    def self.load_version
      version_file = "#{config.root}/version.txt"
      if File.exist?(version_file)
        return IO.read(version_file).strip
      elsif File.exist?('.git/config') && `which git`.size > 0
        version = `git rev-parse --short HEAD`
        return version.strip
      end
      "(unknown)"
    end

    config.version = load_version
    config.feedback_url = nil

    portals = YAML.load_file(Rails.root.join('config/portals.yml'))
    config.portals = (portals[Rails.env.to_s] || portals['defaults']).with_indifferent_access

    services = ERB.new File.new(Rails.root.join('config/services.yml.erb')).read
    config.services = YAML.load services.result(binding)
    config.cmr_env = 'prod'
    services = config.services
    config.urs_client_id = services['urs'][Rails.env.to_s][services['earthdata'][config.cmr_env]['urs_root']]
    config.sit_urs_client_id = services['urs'][Rails.env.to_s][services['earthdata']['sit']['urs_root']]
    config.enable_esi_order_chunking = (ENV['enable_esi_order_chunking'] || services['edsc'][Rails.env.to_s]['enable_esi_order_chunking'].to_s) == 'true'
    config.cmr_tag_namespace = ENV['cmr_tag_namespace'] || 'edsc'
    config.thumbnail_width = 75
  end
end
