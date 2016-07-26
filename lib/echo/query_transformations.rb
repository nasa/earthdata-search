module Echo
  module QueryTransformations

      def options_to_item_query(options={})
        query = options.dup.symbolize_keys

        load_freetext_query(query)
        and_query(query)
        pattern_query(query)

        query
      end

      def options_to_collection_query(options={})
        query = temporal_limit_query(options)
        options_to_item_query(query)
      end

      def options_to_facet_query(options={})
        options_to_collection_query(options)
      end

      def options_to_granule_query(options={})
        options_to_item_query(options)
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
        value.strip.gsub(/\s+/, '* ') + '*'
      end

      # Return a copy of value with all catalog-rest wildcards escaped.  If value is an Enumerable,
      # its string and enumerable elements will be escaped
      def catalog_escape(value)
        if value.is_a? String
          # Escape % and _ with a single \.  No idea why it takes 4 slashes before \1 to output a single slash
          value.gsub(/(%)/, '\\\\\1') # don't escape _ in CMR
        elsif value.is_a? Hash
          Hash[value.map {|k, v| [k, catalog_escape(v)]}]
        elsif value.is_a? Enumerable
          value.map {|v| catalog_escape(v)}
        elsif !value.is_a?(TrueClass) && !value.is_a?(FalseClass) && !value.is_a?(Numeric)
          Rails.logger.warn("Unrecognized value type for #{value} (#{value.class})")
        end
      end

      def pattern_query(query)
        if query[:readable_granule_name]
          query[:options] ||= Hash.new
          query[:options][:readable_granule_name] = Hash.new
          query[:options][:readable_granule_name][:pattern] = true
        end
      end

      # If Campaigns, Platforms, Instruments, or Sensors are selected
      # add the option to perform an AND search in the catalog
      def and_query(query)
        if query[:platform_h]
          query[:options] ||= Hash.new
          query[:options][:platform_h] = Hash.new
          query[:options][:platform_h][:and] = true
        end
        if query[:instrument_h]
          query[:options] ||= Hash.new
          query[:options][:instrument_h] = Hash.new
          query[:options][:instrument_h][:and] = true
        end
        if query[:data_center_h]
          query[:options] ||= Hash.new
          query[:options][:data_center_h] = Hash.new
          query[:options][:data_center_h][:and] = true
        end
        if query[:project_h]
          query[:options] ||= Hash.new
          query[:options][:project_h] = Hash.new
          query[:options][:project_h][:and] = true
        end
        if query[:processing_level_id_h]
          query[:options] ||= Hash.new
          query[:options][:processing_level_id_h] = Hash.new
          query[:options][:processing_level_id_h][:and] = true
        end
      end

      def temporal_limit_query(options)
        options.to_hash.symbolize_keys!
        options[:options] ||= Hash.new
        options[:options][:temporal] = Hash.new
        options[:options][:temporal][:limit_to_granules] = true
        options
      end
  end
end
