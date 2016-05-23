class HierarchicalFacetPresenter
  def initialize(id, name, facet, query, options={})
    @id = id
    @name = name
    @query_template = options[:template] || ':param'
    @order = options[:order]
    if options[:root]
      facet = descend_one_level(facet, options[:root][:subfield], options[:root][:value])
    end
    @facet = descend_into_query(facet, query)
  end

  def as_json
    {
      'name' => @name,
      'values' => @facet.as_json
    }
  end

  private

  def descend_into_query(facet, query)
    order = @order.reverse
    values = []
    while (value = subfield_query_value(order.last, query)).present?
      values += value
      facet = descend_one_level(facet, order.pop, value.first[:term])
    end
    if order.size > 0 && facet.present?
      key = order.pop
      param = @query_template.gsub(':param', key)
      values += Array.wrap(facet[key]).map do |child|
        {term: child['value'].strip, param: param, count: child['count']} if child['value']
      end.compact.sort_by { |c| c[:term] }
    end
    values
  end

  def subfield_query_value(name, query)
    param = @query_template.gsub(':param', name)
    value = query[param]
    Array.wrap(query[param]).map do |value|
      unescaped = URI.unescape(value.gsub('+', ' '))
      {term: unescaped, param: param}
    end
  end

  def descend_one_level(facet, subfield, value)
    if facet.present? && facet[subfield]
      Array.wrap(facet[subfield]).find do |child|
        child['value'].strip == value.strip
      end
    else
      nil
    end
  end
end
