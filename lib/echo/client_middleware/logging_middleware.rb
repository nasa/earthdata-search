module Echo
  module ClientMiddleware
    class LoggingMiddleware < Faraday::Response::Middleware
      extend Forwardable
      include Term::ANSIColor

      def initialize(app, logger=nil)
        super(app)

        @logger = logger || (defined?(Rails) && Rails.logger) || begin
          require 'logger'
          ::Logger.new(STDOUT)
        end
      end

      def_delegators :@logger, :debug, :info, :warn, :error, :fatal

      def call(env)
        method = env[:method].upcase
        url = env[:url]
        response_message = lambda do |time, result|
          status_code = env[:status]
          summary = env[:summary]
          message = [method, url, "(#{status_code})", summary, "[#{time}s]"].compact.join(' ')
          if status_code < 400
            info(green(message))
          else
            warn(red(message))
          end
        end
        info(yellow("#{method} #{url}"))
        Echo::Util.time(@logger, response_message) { super(env) }
      end
    end
  end
end
