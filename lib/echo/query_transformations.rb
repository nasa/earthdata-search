module Echo
  module QueryTransformations

      def options_to_item_query(options={}, remove_spatial=false)
        query = options.dup.symbolize_keys

        load_freetext_query(query)
        and_query(query)
        pattern_query(query)
        relevancy_query(query)

        query
      end

      def options_to_collection_query(options={})
        options_to_item_query(options)
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

      # When a collection search has one of these fields:
      #   keyword
      #   platform
      #   instrument
      #   sensor
      #   two_d_coordinate_system_name
      #   science_keywords
      #   project
      #   processing_level_id
      #   data_center
      #   archive_center
      # We should sort collection results by: sort_key[]=has_granules&sort_key[]=score
      # Otherwise, we should sort collection results by: sort_key[]=has_granules&sort_key[]=entry_title
      def relevancy_query(query)
        query[:sort_key] = Array.wrap('has_granules')
        # sensor, archive_center and two_d_coordinate_system_name were removed from the available facets but it doesn't
        # hurt to list them here though.
        relevancy_capable_fields = [:keyword, :platform, :instrument, :sensor, :two_d_coordinate_system_name,
                                    :science_keywords, :project, :processing_level_id, :data_center, :archive_center]
        if (query.keys & relevancy_capable_fields).empty?
          query[:sort_key].push 'entry_title'
        else
          query[:sort_key].push 'score'
        end
      end
  end
end
