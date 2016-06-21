class FlatFacetPresenter
  def initialize(id, name, json_facet, query, options={})
    @id = id
    @name = name
    @param = options[:param] || "#{@id.singularize}[]"
    @value_subfield = options[:value_subfield] || 'short_name'
    facet = json_facet.key?('subfields') ? flatten_hierarchy(json_facet) : json_facet
    all_counts = Array.wrap(facet['value-counts'])
    counts_without_applied = trim(all_counts, options[:max_size] || 50)
    @counts = insert_applied(counts_without_applied, query).sort

    @query = query
  end

  def flattened_facet
    {"field" => @id, "value-counts" => @counts}
  end

  def as_json
    values = @counts.map { |value, count| {term: value, count: count} }
    {name: @name, param: @param, values: values}
  end

  private

  def flatten_hierarchy(json)
    {"field" => json["field"], "value-counts" => flatten_recursive(json).sort_by(&:second).reverse}
  end

  def flatten_recursive(json)
    Array.wrap(json).map do |facet|
      if facet[@value_subfield].present?
        facet[@value_subfield].map {|value| [value['value'], value['count']]}
      else
        subfields = Array.wrap(facet['subfields'])
        subfields.map {|f| flatten_recursive(facet[f])}.flatten(1)
      end
    end.flatten(1)
  end

  def trim(counts, max_size)
    counts[0...max_size].map { |value, count| [value.strip, count] }
  end

  def insert_applied(counts, query)
    counts = counts.dup
    Array.wrap(query[@param]).each do |value|
      term = URI.unescape(value.gsub('+', ' '))
      counts << [term, 0] unless counts.any? {|value, count| value == term}
    end
    counts
  end
end
