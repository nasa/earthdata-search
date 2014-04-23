module Echo
  module QueryTransformations
    extend ActiveSupport::Concern

    module ClassMethods
      def options_to_item_query(options={}, remove_spatial=false)
        query = options.dup.symbolize_keys

        load_freetext_query(query)
        and_query(query)

        query
      end

      def options_to_dataset_query(options={})
        query = options_to_item_query(options)

        # catalog-rest rejects two_d_coordinate_system[coordinates] on dataset queries for no good reason
        query[:two_d_coordinate_system].delete('coordinates') if query[:two_d_coordinate_system].present?

        query
      end

      def options_to_facet_query(options={})
        query = options_to_dataset_query(options)

        # TODO: Spatial is currently breaking facet searches.
        # Remove this after it has been fixed in catalog rest
        query.delete(:point)
        query.delete(:bounding_box)
        query.delete(:polygon)
        query.delete(:line)

        query
      end

      def options_to_granule_query(options={})
        query = options.dup.symbolize_keys
        query.delete(:free_text)
        options_to_item_query(query)
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

      # If Campaigns, Platforms, Instruments, or Sensors are selected
      # add the option to perform an AND search in the catalog
      def and_query(query)
        if query[:campaign]
          query[:options] ||= Hash.new
          query[:options][:campaign] = Hash.new
          query[:options][:campaign][:and] = true
        end
        if query[:platform]
          query[:options] ||= Hash.new
          query[:options][:platform] = Hash.new
          query[:options][:platform][:and] = true
        end
        if query[:instrument]
          query[:options] ||= Hash.new
          query[:options][:instrument] = Hash.new
          query[:options][:instrument][:and] = true
        end
        if query[:sensor]
          query[:options] ||= Hash.new
          query[:options][:sensor] = Hash.new
          query[:options][:sensor][:and] = true
        end
      end
    end
  end
end
