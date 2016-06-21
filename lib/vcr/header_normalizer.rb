module VCR
  # Prevents header values from being saved to cassettes
  # and instead substitutes key names
  class HeaderNormalizer
    attr_reader :header
    attr_reader :value
    attr_reader :substitute

    def initialize(header, value, substitute)
      @header = header
      @value = value
      @substitute = substitute
    end

    def forward(interaction)
      header_values(interaction).map! do |current|
        current == @value ? @substitute : current
      end
    end

    def reverse(interaction)
      header_values(interaction).map! do |current|
        current == @substitute ? @value : current
      end
    end

    private

    def header_values(interaction)
      if interaction['request'] && interaction['request']['headers']
        interaction['request']['headers'][@header] || []
      else
        []
      end
    end
  end
end
