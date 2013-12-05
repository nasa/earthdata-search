RSpec::Matchers.define :have_class do |expected|
  match do |node|
    node['class'] =~ /(^|\s)#{expected}(\s|$)/
  end
end
