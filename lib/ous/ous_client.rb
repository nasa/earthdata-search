module Ous
  class OusClient < BaseClient
    def get_coverage(params, format = 'json')
      default_params = {
        format: format
      }

      get('', default_params.merge(params))
    end
  end
end
