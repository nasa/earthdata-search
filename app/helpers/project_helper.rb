module ProjectHelper

  def strip_param_by_key(key)
    request.query_parameters.delete(key)
    query_string = request.query_parameters.to_query
    if query_string.present?
      "?#{query_string}"
    else
      nil
    end
  end

end
