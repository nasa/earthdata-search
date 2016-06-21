# This file is used by Rack-based servers to start the application.

ENV['IS_RACK_RUN'] ||= 'true'
require ::File.expand_path('../config/environment',  __FILE__)
run EarthdataSearchClient::Application
