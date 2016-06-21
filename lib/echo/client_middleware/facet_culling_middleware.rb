module Echo
  module ClientMiddleware
    class FacetCullingMiddleware < FaradayMiddleware::ResponseMiddleware
      COUNT_THRESHOLD = 100

      def self.cull(body)
        if Array.wrap(body['feed']['entry']).size > 1
          body['feed']['facets'].reject! do |facet|
            ['detailed_variable', 'sensor', 'archive_center'].include?(facet['field'])
          end
          body['feed']['facets'].each do |facet|
            if facet['subfields']
              reduce_facet_subtrees(facet)
            end
            if facet['value-counts']
              facet['value-counts'] = facet['value-counts'].reject { |value, count| count < COUNT_THRESHOLD }
            end
          end
        end
        body['feed']['reduced'] = true
      end

      def self.reduce_facet_subtrees(facet)
        if facet['subfields']
          facet['subfields'].each do |field|
            if ['variable_level_2', 'variable_level_3', 'detailed_variable', 'long_name'].include?(field)
              facet[field] = []
            elsif !['category', 'topic'].include?(field) # Always keep first couple levels of science keywords
              facet[field] = facet[field].reject { |f| f.key?('count') && f['count'] < COUNT_THRESHOLD }
              facet[field].each do |facetfield|
                reduce_facet_subtrees(facetfield)
              end
            end
          end
        end
      end

      def process_response(env)
        self.class.cull(env[:body])
        env
      end

      def parse_response?(env)
        body = env[:body]
        body.is_a?(Hash) && body['feed'] && body['feed']['facets'] && !body['feed']['reduced']
      end
    end
  end
end
