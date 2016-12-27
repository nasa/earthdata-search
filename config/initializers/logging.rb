log_level = String(ENV['LOG_LEVEL'] || "info").upcase
ActiveRecord::Base.logger.level = Logger.const_get(log_level)
