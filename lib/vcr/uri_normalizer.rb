module VCR
  # Prevents URI substrings from being saved to cassettes
  # and instead substitutes key names
  class UriNormalizer
    attr_reader :uri_substring
    attr_reader :substitute

    def initialize(uri_substring, substitute)
      @uri_substring = uri_substring
      @substitute = substitute
    end

    def forward(interaction)
      interaction['request']['uri'].gsub!(@uri_substring, @substitute)
    end

    def reverse(interaction)
      interaction['request']['uri'].gsub!(@substitute, @uri_substring)
    end
  end
end
