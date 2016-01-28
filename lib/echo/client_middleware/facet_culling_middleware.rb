module Echo
  module ClientMiddleware
    class FacetCullingMiddleware < FaradayMiddleware::ResponseMiddleware
      def self.cull(body)
        hierarchical = body['feed']['id'].include?('hierarchical_facets=true')
        body['feed']['facets'].each do |facet|
          if !hierarchical && !['archive_center', 'data_center', 'platform', 'instrument'].include?(facet['field'])
            facet['value-counts'] = []
          end
          if facet['value-counts'] && facet['value-counts'].size > 20
            facet['value-counts'] = facet['value-counts'][0...50].sort[0...20]
          end
          if facet['subfields']
            if facet['field'] == 'science_keywords'
              reduce_facet_subtrees(facet)
            else
              # Remove all non-science keyword facets
              facet['subfields'].each do |field|
                facet[field] = []
              end
            end
          end
        end
        body['feed']['reduced'] = true
      end

      def self.reduce_facet_subtrees(facet)
        if facet['subfields']
          facet['subfields'].each do |field|
            if ['variable_level_2', 'variable_level_3', 'detailed_variable'].include?(field)
              facet[field] = []
            else
              facet[field] = facet[field][0...50] if facet[field].size > 50
              facet[field] = facet[field].sort_by {|f| f['value']}
              facet[field] = facet[field][0...5] if facet[field].size > 5
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
