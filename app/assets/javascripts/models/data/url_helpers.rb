require "addressable/uri"

module Helpers
  module UrlHelpers

    class QueryBuilder
      def initialize(options)
        params = {}

        params['o'] = 'tf' unless options[:facets]

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
        [url, query.presence].compact.join('?')
      end
    end

    def load_page(url, options={})
      visit QueryBuilder.new(options).add_to(url)
    end
  end
end
