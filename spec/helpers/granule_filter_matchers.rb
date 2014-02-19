RSpec::Matchers.define :filter_granules_from do |expected|
  match do |selector|
    selector.find(".master-overlay-secondary-content").click
    expect(selector).to have_no_content(expected.to_s + ' Granules')

    number_granules = expect(selector.text).to match_regex /\d+ Granules/
    after_granule_count = number_granules.to_s.split(" ")[0].to_i

    expected > after_granule_count
  end
end

RSpec::Matchers.define :reset_granules_to do |expected|
  match do |selector|
    expect(selector).to have_content(expected.to_s + ' Granules')
  end
end
