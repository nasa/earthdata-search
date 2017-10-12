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

  def back_link_label
    if request.referrer
      if request.referrer.include?('search')
        'to Search Session'
      elsif request.referrer.include?('project')
        'to Project List'
      else
        ''
      end
    else
      ''
    end
  end

end
