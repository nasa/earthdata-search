require 'faraday_middleware/response_middleware'

module Echo
  module ClientMiddleware
    class EventMiddleware < FaradayMiddleware::ResponseMiddleware
      def process_response(env)
        body = env[:body]

        sanitizer = ActionView::Base.full_sanitizer
        now = DateTime.now

        # Filter events that are not current and the ASTER GDEM V2 Tutorial hack event which shows
        # a Reverb tutorial.  NCRS have been filed to make this unnecessary.
        env[:body] = Array.wrap(body['calendar_events']).reject do |event|
          title = event['title']
          end_date = event['end_date']
          reject = title == 'ASTER GDEM V2 Tutorial' || (end_date.present? && end_date < now)
          # Remove markup from the message body, which seems to assume Reverb formatting
          event['message'] = sanitizer.sanitize(event['message']).gsub('&nbsp;', ' ').gsub(/\s+/, ' ') unless reject
          reject
        end

      end

      def parse_response?(env)
        body = env[:body]
        body.is_a?(Hash) && (body['calendar_events'] || body['nil_classes'])
      end
    end
  end
end
