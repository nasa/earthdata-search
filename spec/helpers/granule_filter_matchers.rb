RSpec::Matchers.define :filter_granules_from do |expected|
  match do |selector|
    wait_for_xhr
    # synchronize do
      after_granule_count = selector.text.match(/(\d{1,3}(,\d{3})*(\.\d+)?) Granule/).captures.first.gsub(/,/, '').to_i

      expect(expected.to_s.gsub(/,/, '').to_i).to be > after_granule_count
    # end
  end
end

RSpec::Matchers.define :reset_granules_to do |expected|
  match do |selector|
    wait_for_xhr
    synchronize do
      raise 'Granules not displayed' unless selector.text =~ /(\d{1,3}(,\d{3})*(\.\d+)?) Granules/
      expect(Regexp.last_match(1).to_i).to be >= expected.to_i
    end
  end
end
