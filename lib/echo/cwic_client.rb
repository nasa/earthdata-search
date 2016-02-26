module Echo
  class CwicClient < BaseClient
    def get_cwic_granules(short_name, start_page=1, count=10, temporal=nil)
      params = default_params.merge({
                                        datasetId: short_name,
                                        startPage: start_page,
                                        count: count
                                    })
      if temporal
        time_start, time_end = temporal.split(',')
        # Remove milliseconds from the date/time
        params[:timeStart] = time_start.gsub(/\.\d+Z$/, 'Z') if time_start.present?
        params[:timeEnd] = time_end.gsub(/\.\d+Z$/, 'Z') if time_start.present?
      end

      with_unescaped_colons do
        get("/opensearch/granules.atom", params)
      end
    end

    def get_cwic_granule(url)
      with_unescaped_colons do
        get(url)
      end
    end

    private

    def default_params
      {clientId: Rails.configuration.cmr_client_id}
    end

    def with_unescaped_colons(&block)
      # CWIC does not accept escaped colons in URLs, and they're valid in query params,
      # so we add colon to the list of things Faraday should not escape. We also suppress
      # warnings about changing constants. This is clearly a hack and is fixed with an
      # upgrade to Faraday. CWIC may fix this on their end.
      # Note: This could cause issues running multi-threaded environments, though this
      #       is never a problem with current CWIC code.
      # FIXME: Upgrade Faraday or remove once CWIC fixes this.
      warn_level = $VERBOSE
      $VERBOSE = nil
      orig_escape = Faraday::Utils::ESCAPE_RE
      Faraday::Utils.const_set(:ESCAPE_RE, /[^a-zA-Z0-9 .~_:-]/)
      Rails.logger.warn("WARNING: Not escaping colons in URL")
      result = block.call
      Faraday::Utils.const_set(:ESCAPE_RE, orig_escape)
      $VERBOSE = warn_level
      result
    end
  end
end
