require "addressable/uri"

module Helpers
  module UrlHelpers

    class QueryBuilder
      def add_to(url, options)
        url = url.to_s
        url = '' if url == 'root'
        url = '/' + url unless url.start_with?('/')
        # Debugging
        #puts "Page: #{[url, query.presence].compact.join('?')}"
        [path_from_options(url, options), params_from_options(options)].compact.join('?')
      end

      private

      def path_from_options(url, options)
        if url == '/search'
          url = '/search/datasets'
          url = '/search/map' if options[:overlay] == false
          url = '/search/project' if options[:view] == :project
          url = '/search' if options[:facets]
          url = "/search/#{options[:focus]}/granules" if options[:focus]
        end
        url
      end

      def params_from_options(options)
        params = {}

        [:bounding_box, :point, :polygon].each do |type|
          params[type.to_s] = spatial(options[type]) if options[type]
        end

        params['temporal'] = temporal(*options[:temporal]) if options[:temporal]

        params['ds'] = options[:project].join('!') if options[:project]

        query_from_params(params)
      end

      def query_from_params(params)
        uri = Addressable::URI.new
        uri.query_values = params
        uri.query
      end

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
      visit QueryBuilder.new.add_to(url, options)
    end
  end
end
