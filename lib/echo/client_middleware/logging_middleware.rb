module Echo
  module ClientMiddleware
    class LoggingMiddleware < Faraday::Response::Middleware
      extend Forwardable

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
        if url.path.start_with?('/search/') && method.to_s == 'POST'
          url = [url, env[:body]].join('?')
        end
        response_message = lambda do |time, result|
          status_code = env[:status]
          summary = env[:summary]
          message = [method, url, "(#{status_code})", summary, "[#{time}s]"].compact.join(' ')
          if status_code && status_code < 400
            info(green(message))
          else
            warn(red(message))
          end
        end
        info(yellow("#{method} #{url}"))
        time(@logger, response_message) { super(env) }
      end

      private

      def time(logger, message, &block)
        start = Time.now
        result = yield
      ensure
        if message.is_a?(Proc)
          message.call(Time.now-start, result)
        else
          logger.info("#{message} [#{Time.now - start}s]")
        end
      end

      def green(text)
        color("0;32", text)
      end

      def red(text)
        color("0;31", text)
      end

      def yellow(text)
        color("0;33", text)
      end

      def color(code, text)
        "\e[#{code}m#{text}\e[0m"
      end
    end
  end
end
