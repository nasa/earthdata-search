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

RSpec::Matchers.define :have_query_param do |params|
  def query(page)
    URI.parse(page.current_url).query
  end

  match do |page|
    synchronize do
      # Test one at a time to be order-independent
      params.each do |k, v|
        expect(query(page).include?({k => v}.to_param)).to be_true
      end
    end
  end

  failure_message_for_should do |page|
    "expected page to have query params #{params.to_param}, got #{query(page).inspect}"
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

RSpec::Matchers.define :have_path_prefix do |string|
  def path(page)
    URI.parse(page.current_url).path
  end

  match do |page|
    synchronize do
      expect(path(page)).to start_with(string)
    end
  end

  failure_message_for_should do |page|
    "expected page to have path prefix #{string.inspect}, got #{path(page).inspect}"
  end
end

RSpec::Matchers.define :have_no_path_prefix do |string|
  def path(page)
    URI.parse(page.current_url).path
  end

  match do |page|
    synchronize do
      expect(path(page)).not_to start_with(string)
    end
    true
  end

  failure_message_for_should do |page|
    "expected page to not have path prefix #{string.inspect}, got #{path(page).inspect}"
  end
end
