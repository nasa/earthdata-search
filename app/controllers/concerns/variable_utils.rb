module VariableUtils
  extend ActiveSupport::Concern

  DEFAULT_PAGE_SIZE = 20

  def retrieve_variables(params = {}, token = nil)
    cmr_params = {
      # page_size: DEFAULT_PAGE_SIZE
    }.merge(params.stringify_keys).select { |k, _v| %w(concept_id cmr_format).include?(k) }

    echo_client.get_variables(cmr_params, token)
  end

  def retrieve_variable(variable_id, token = nil, format = 'umm_json')
    echo_client.get_variable(variable_id, token, format)
  end

  def variable_names(params = {}, token = nil)
    retrieve_variables(params, token).body.fetch('items', []).map { |variable| variable.fetch('umm', {})['Name'] }.reject(&:blank?)
  end
end
