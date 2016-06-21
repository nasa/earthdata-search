module VCR
  class NullSerializer
    def file_extension
      ""
    end

    def serialize(hash)
      hash
    end

    def deserialize(string)
      string
    end
  end
end
