class FacetsPresenter
  # Order matters in SCIENCE_KEYWORDS
  SCIENCE_KEYWORDS = ['topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3']
  KEYWORD_CHILD = {
    'topic' => 'term',
    'term' => 'variable_level_1',
    'variable_level_1' => 'variable_level_2',
    'variable_level_2' => 'variable_level_3',
    'variable_level_3' => nil
  }

  UNWANTED_FACETS = [
    'sensor',
    'two_d_coordinate_system_name',
    'archive_centers',
    'detailed_variable'
  ]
  FACET_OPTIONS = {
    'features' => {
      index: 0,
      param: 'features[]'
    },
    'science_keywords' => {
      index: 1,
      hierarchical: true,
      template: 'science_keywords[0][:param][]',
      root: {
        subfield: 'category',
        value: 'EARTH SCIENCE'
      },
      order: [
        'topic',
        'term',
        'variable_level_1',
        'variable_level_2',
        'variable_level_3'
      ]
    }
  }

  IDS_TO_NAMES = {
    'science_keywords' => 'Keywords',
    'data_centers' => 'Organization',
    'features' => 'Features'
  }

  def initialize(json_facets, query_string)
    # Hash of parameters to values where hashes and arrays in parameter names are not interpreted
    @query = query_string
             .gsub('%5B', '[')
             .gsub('%5D', ']')
             .split('&')
             .map {|kv| kv.split('=')}
             .group_by(&:first)
    @query.each do |k, v|
      @query[k] = v.map(&:last)
    end
    json_facets = exclude_unwanted_facets(Array.wrap(json_facets))
    json_facets = add_fake_json_facets(json_facets)
    json_facets = order_facets(json_facets)
    @facets = json_facets.map { |json_facet| facet_for_json(json_facet, @query) }
  end

  def as_json
    @facets.map(&:as_json).compact
  end

  private

  def order_facets(json_facets)
    json_facets = json_facets.dup
    ordered_facets = FACET_OPTIONS.map do |id, options|
      [options[:index], id]
    end.compact.sort
    ordered_facets.each do |index, id|
      facet = json_facets.find {|json_facet| json_facet['field'] == id}
      if facet
        json_facets.delete(facet)
        json_facets.insert(index, facet)
      end
    end
    json_facets
  end

  def exclude_unwanted_facets(facets)
    facets.reject {|f| UNWANTED_FACETS.include?(f['field'])}
  end

  def add_fake_json_facets(json_facets)
    [{'field' => 'features', 'value-counts' => [
        ['Map Imagery'],
        ['Subsetting Services'],
        ['Near Real Time']]
     }] + json_facets
  end

  def facet_for_json(json_facet, query)
    id = json_facet['field']
    name = IDS_TO_NAMES[id] || id.humanize.capitalize.singularize
    options = FACET_OPTIONS[id] || {}
    if options[:hierarchical]
      HierarchicalFacetPresenter.new(id, name, json_facet, query, options)
    else
      FlatFacetPresenter.new(id, name, json_facet, query, options)
    end
  end

end
