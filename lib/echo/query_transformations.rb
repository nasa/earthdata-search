module Echo
  module QueryTransformations
    extend ActiveSupport::Concern

    module ClassMethods
      def options_to_item_query(options={})
        query = options.dup.symbolize_keys

        load_freetext_query(query)

        query
      end

      def options_to_granule_query(options={})
        query = options.dup.symbolize_keys
        query.delete(:free_text)
        options_to_item_query(query)
      end

      def options_to_facet_query(options={})
        options = options.with_indifferent_access

        simple_facet_params = {
          :campaign => :campaign_sn,
          :platform => :platform_sn,
          :instrument => :instrument_sn,
          :sensor => :sensor_sn,
          :two_d_coordinate_system_name => :twod_coord_name,
          :processing_level => :processing_level
        }

        simple_facet_params.each do |param, facet_param|
          if options[param].present?
            return {filter: facet_param, value: options[param].first}
          end
        end

        if options[:science_keywords].present?
          keyword, value = options[:science_keywords].first
          return {filter: "#{keyword}_keyword", value: value}
        end
        {}
      end

      private

      def load_freetext_query(query)
        freetext = query.delete(:free_text)
        if freetext
          # Escape catalog-rest reserved characters, then add a wildcard character to the
          # end of each word to allow partial matches of any word
          query[:keyword] = catalog_wildcard(catalog_escape(freetext))
        end
      end

      # Given a string value, returns the string with catalog-rest wildcard characters appended
      # to each whitespace-delimited word, allowing for partial matches of each word.
      # "some string" becomes "some% string%"
      def catalog_wildcard(value)
        value.strip.gsub(/\s+/, '% ') + '%'
      end

      # Return a copy of value with all catalog-rest wildcards escaped.  If value is an Enumerable,
      # its string and enumerable elements will be escaped
      def catalog_escape(value)
        if value.is_a? String
          # Escape % and _ with a single \.  No idea why it takes 4 slashes before \1 to output a single slash
          value.gsub(/(%|_)/, '\\\\\1')
        elsif value.is_a? Hash
          Hash[value.map {|k, v| [k, catalog_escape(v)]}]
        elsif value.is_a? Enumerable
          value.map {|v| catalog_escape(v)}
        elsif !value.is_a?(TrueClass) && !value.is_a?(FalseClass) && !value.is_a?(Numeric)
          Rails.logger.warn("Unrecognized value type for #{value} (#{value.class})")
        end
      end
    end
  end
end
