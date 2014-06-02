require "addressable/uri"

module Helpers
  module UrlHelpers

    class QueryBuilder
      def initialize(options)
        params = {}

        [:bounding_box, :point, :polygon].each do |type|
          params[type.to_s] = spatial(options[type]) if options[type]
        end

        params['temporal'] = temporal(*options[:temporal]) if options[:temporal]

        params['ds'] = options[:project].join('!') if options[:project]

        o = 'tfftfft0' # No facets visible
        o = 'ftftfft0' if options[:overlay] == false
        o = 'tffttft1' if options[:view] == :project
        o = nil if options[:facets]

        params['o'] = o unless o.nil?

        @params = params
      end

      def query
        uri = Addressable::URI.new
        uri.query_values = @params
        uri.query
      end

      def add_to(url)
        url = url.to_s
        url = '' if url == 'root'
        url = '/' + url unless url.start_with?('/')
        # Debugging
        #puts "Page: #{[url, query.presence].compact.join('?')}"
        [url, query.presence].compact.join('?')
      end

      private

      def temporal(start, stop=nil, range=nil)
        start = start.strftime('%Y-%m-%dT%H:%M:%S.000Z') if start && start.is_a?(DateTime)
        stop = stop.strftime('%Y-%m-%dT%H:%M:%S.000Z') if stop && stop.is_a?(DateTime)
        ([start || '', stop || ''] + Array.wrap(range)).join(',')
      end

      def spatial(latlngs)
        lnglats = latlngs.each_slice(2).map(&:reverse).flatten
        lnglats.join(',')
      end
    end

    def load_page(url, options={})
      visit QueryBuilder.new(options).add_to(url)
    end
  end
end
