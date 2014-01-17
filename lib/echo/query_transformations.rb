module Echo
  module QueryTransformations
    extend ActiveSupport::Concern

    module ClassMethods
      def options_to_item_query(options={})
        options = options.with_indifferent_access

        query = {}

        load_query_page(options, query)
        load_query_page_size(options, query)
        load_echo_collection_query(options, query)
        load_keyword_query(options, query)
        load_spatial_query(options, query)
        load_temporal_query(options, query)
        load_browse_only_query(options, query)
        load_facets_query(options, query, false)

        query
      end

      def options_to_facet_query(options={})
        query = {}

        load_facets_query(options, query, true)

        query
      end

      private

      def load_query_page(options, query)
        query[:page_num] = options[:page] if options[:page]
      end

      def load_query_page_size(options, query)
        query[:page_size] = options[:page_size] if options[:page_size]
      end

      def load_echo_collection_query(options, query)
        query[:echo_collection_id] = Array.wrap(options[:echo_collection_id]) if options[:echo_collection_id]
      end

      def load_browse_only_query(options, query)
        query[:browse_only] = options[:browse_only] if options[:browse_only]
      end

      def load_keyword_query(options, query)
        if options[:keywords]
          # Escape catalog-rest reserved characters, then add a wildcard character to the
          # end of each word to allow partial matches of any word
          query[:keyword] = catalog_wildcard(catalog_escape(options[:keywords]))
        end
      end

      def load_spatial_query(options, query)
        spatialStr = options[:spatial]
        if spatialStr.present?
          type, *pointStrs = spatialStr.split(':')
          type = type.gsub('-', '_').to_sym
          type = :polygon if type == :antarctic_rectangle || type == :arctic_rectangle

          # Polygon conditions must have their last point equal to their first
          pointStrs << pointStrs.first if type == :polygon

          points = pointStrs.map { |s| s.split(',').map(&:to_f) }

          points.map! do |lon, lat|
            lon += 360 while lon < -180
            lon -= 360 while lon > 180
            lat = [lat,  90.0].min
            lat = [lat, -90.0].max
            [lon, lat]
          end

          query[type] = points.flatten.join(',')
        end
      end

      def load_temporal_query(options, query)
        if options[:temporal]
          query[:temporal] = options[:temporal].flatten.join(',')
        end
      end

      def load_facets_query(options, query, load_facet_options)
        if options[:facets]
          options[:facets].each do |opt|
            facet = opt[1]
            if load_facet_options
              query[:filter] = transform_facet_type(facet[:type])[1]
              query[:value] = facet[:name]
            else
              type = transform_facet_type(facet[:type])[0]
              # putting the values into an array currently
              # forces an OR search waiting on NCR #11014369
              # for an AND solution
              query[type] = [] unless query[type]
              query[:options] ||= {}
              query[:options] = query[:options].merge(type => {ignore_case: false})
              if type == "science_keywords"
                keyword = transform_science_keyword(facet[:type])
                query[type] << Hash.new
                query[type][0] = Hash.new
                query[type][0][keyword] = facet[:name]
              else
                query[type] << facet[:name]
              end
            end
          end
        end
      end

      # Returns array [dataset_search_query_type, facet_search_query_type]
      def transform_facet_type(type)
        case type
        when "Campaigns"
          ["campaign","campaign_sn"]
        when "Platforms"
          ["platform","platform_sn"]
        when "Instruments"
          ["instrument","instrument_sn"]
        when "Sensors"
          ["sensor","sensor_sn"]
        when "2D Coordinate Name"
          ["two_d_coordinate_system_name","twod_coord_name"]
        when "Category Keyword"
          ["science_keywords","category_keyword"]
        when "Topic Keyword"
          ["science_keywords","topic_keyword"]
        when "Term Keyword"
          ["science_keywords","term_keyword"]
        when "Variable Level 1 Keyword"
          ["science_keywords","variable_level_1_keyword"]
        when  "Variable Level 2 Keyword"
          ["science_keywords","variable_level_2_keyword"]
        when "Variable Level 3 Keyword"
          ["science_keywords","variable_level_3_keyword"]
        when "Detailed Variable Keyword"
          ["science_keywords","detailed_variable_keyword"]
        when "Processing Level"
          ["processing_level","processing_level"]
        end
      end

      def transform_science_keyword(name)
        case name
        when "Category Keyword"
          "category"
        when "Topic Keyword"
          "topic"
        when "Term Keyword"
          "term"
        when "Variable Level 1 Keyword"
          "variable_level_1"
        when "Variable Level 2 Keyword"
          "variable_level_2"
        when "Variable Level 3 Keyword"
          "variable_level_3"
        when "Detailed Variable Keyword"
          "detailed_variable"
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
