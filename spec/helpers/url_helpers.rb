require "addressable/uri"

module Helpers
  module UrlHelpers

    class QueryBuilder
      def add_to(url, options)
        url = url.to_s
        url = '' if url == 'root'
        url = '/' + url unless url.start_with?('/')
        result = [path_from_options(url, options), params_from_options(options)].map(&:presence).compact.join('?')
        # Debugging
        #puts "Page: #{result}"
        result
      end

      private

      def path_from_options(url, options)
        if url == '/search'
          url = '/search/collections' unless options[:facets]
          url = '/search/map' if options[:overlay] == false
          url = '/search/project' if options[:view] == :project
          url = "/search/granules" if options[:focus]
        end
        url = "/portal/#{options[:portal]}#{url}" if options[:portal]
        url
      end

      def params_from_options(options)
        params = {}

        [:bounding_box, :point, :polygon].each do |type|
          params[type.to_s] = spatial(options[type]) if options[type]
        end

        envs = {sit: 'sit', uat: 'uat', prod: 'prod'}
        params['cmr_env'] = envs[options[:env]] if options[:env]
        params['qt'] = temporal(*options[:temporal]) if options[:temporal]
        params['tl'] = "#{options[:timeline].to_i}!4!!" if options[:timeline]
        params['sgd'] = options[:granule_id] if options[:granule_id]
        params['q'] = options[:q] if options[:q]
        params['ff'] = options[:ff] if options[:ff]
        params['test_facets'] = true if options[:facets]

        p = ([options[:focus]] + Array.wrap(options[:project])).join('!')
        params['p'] = p if p.present?

        Array.wrap(options[:queries]).each_with_index do |q, i|
          obj = {}
          obj = q if q
          if obj.keys.present?
            params['pg'] ||= {}
            params['pg'][i] = obj
          end
        end

        [:labs].each do |direct_param|
          params[direct_param.to_s] = options[direct_param] if options.key?(direct_param)
        end

        result = []
        params.each do |k, v|
          param = {}
          param[k] = v
          result << param.to_param
        end

        # Ensure sorted order
        result.join('&')
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
      ActiveSupport::Notifications.instrument "edsc.performance", activity: "Page load" do
        visit QueryBuilder.new.add_to(url, options)
      end
      wait_for_xhr
    end
  end
end
