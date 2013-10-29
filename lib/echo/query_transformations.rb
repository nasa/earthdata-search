module Echo
  module QueryTransformations
    extend ActiveSupport::Concern

    module ClassMethods
      def options_to_query(options={})
        options = options.with_indifferent_access

        query = {}

        load_query_page(options, query)
        load_keyword_query(options, query)

        query
      end

      private

      def load_query_page(options, query)
        query[:page_num] = options[:page] if options[:page]
      end

      def load_keyword_query(options, query)
        if options[:keywords]
          # Escape catalog-rest reserved characters, then add a wildcard character to the
          # end of each word to allow partial matches of any word
          query[:keyword] = catalog_wildcard(catalog_escape(options[:keywords]))
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
