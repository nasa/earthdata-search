RSpec::Matchers.define :have_class do |expected|
  match do |node|
    node['class'] =~ /(^|\s)#{expected}(\s|$)/
  end
end

RSpec::Matchers.define :have_query_string do |string|
  def query(page)
    URI.parse(page.current_url).query
  end

  match do |page|
    synchronize do
      expect(query(page)).to eql(string)
    end
  end

  failure_message_for_should do |page|
    "expected page to have query string #{string.inspect}, got #{query(page).inspect}"
  end
end

RSpec::Matchers.define :have_path do |string|
  def path(page)
    URI.parse(page.current_url).path
  end

  match do |page|
    synchronize do
      expect(path(page)).to eql(string)
    end
  end

  failure_message_for_should do |page|
    "expected page to have path #{string.inspect}, got #{path(page).inspect}"
  end
end
