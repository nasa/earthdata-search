RSpec::Matchers.define :have_no_selections do
  match do |page|
    expect(page).to have_no_selector(".timeline-selection *")
  end
end

RSpec::Matchers.define :have_fencepost do |expected|
  match do |page|
    time = expected.to_time.to_i * 1000

    synchronize do
      position = page.evaluate_script "$('#timeline').timeline('timeToPosition', #{time})"
      # We match against the first few significant figures because there seems to be a double -> float
      # conversion going on in capybara-webkit that messes with precision.  Poltergeist gets it right.
      matches = page.all(".timeline-selection line[x1^=\"#{position.to_s[0, 3]}\"]")
      expect(matches.size).to be > 0
    end
  end
end

RSpec::Matchers.define :have_highlighted_selection do |start, stop|
  match do |page|
    start_time = start.to_time.to_i * 1000
    stop_time = stop.to_time.to_i * 1000

    synchronize do
      start_pos = page.evaluate_script "$('#timeline').timeline('timeToPosition', #{start_time})"
      stop_pos = page.evaluate_script "$('#timeline').timeline('timeToPosition', #{stop_time})"
      width = stop_pos - start_pos

      matches = page.all(".timeline-selection rect[x^=\"#{start_pos.to_s[0, 2]}\"][width^=\"#{width.to_s[0, 2]}\"]")

      expect(matches.size).to be > 0
    end

    expect(page).to have_fencepost(start)
    expect(page).to have_fencepost(stop)
  end
end

RSpec::Matchers.define :have_timeline_range do |start, stop|
  match do |page|
    expected_start_time = start.to_time.to_i * 1000
    expected_end_time = stop.to_time.to_i * 1000

    synchronize do
      actual_start_time = page.evaluate_script "$('#timeline').timeline('startTime')"
      actual_end_time = page.evaluate_script "$('#timeline').timeline('endTime')"

      # Allow 1% variance for rounding errors
      delta = 1000 * (start.to_i - stop.to_i).abs / 100

      expect(actual_start_time).to be_within(delta).of(expected_start_time)
      expect(actual_end_time).to be_within(delta).of(expected_end_time)
    end
  end

  failure_message_for_should do |page|
    actual_start_time = page.evaluate_script "$('#timeline').timeline('startTime')"
    actual_start_time = Time.at(actual_start_time / 1000).utc.to_datetime if actual_start_time.present?
    actual_end_time = page.evaluate_script "$('#timeline').timeline('endTime')"
    actual_end_time = Time.at(actual_end_time / 1000).utc.to_datetime if actual_end_time.present?

    "expected to find a timeline range of #{start} - #{stop}, got #{actual_start_time} - #{actual_end_time}"
  end
end

RSpec::Matchers.define :have_end_time do |dt|
  match do |page|
    present = DateTime.new(2014, 3, 1, 0, 0, 0, '+0')

    expected_end_time = (present + dt).to_i * 1000

    synchronize do
      actual_end_time = page.evaluate_script "$('#timeline').timeline('endTime')"

      # Allow 1% variance for rounding errors
      delta = 1000 * (dt.to_i).abs / 100

      expect(actual_end_time).to be_within(delta).of(expected_end_time)
    end
    true
  end

  failure_message_for_should do |page|
    expected_end_time = Time.now + dt
    actual_end_time = page.evaluate_script "$('#timeline').timeline('endTime')"
    actual_end_time = Time.at(actual_end_time / 1000).utc.to_datetime if actual_end_time.present?

    "expected timeline to have end time of #{expected_end_time}, got #{actual_end_time}"
  end
end

RSpec::Matchers.define :have_time_offset do |selector, dt|
   match do |page|
    expected_dt_ms = dt.to_i * 1000

    synchronize do
      expected_dx = page.evaluate_script "-$('#timeline').timeline('timeSpanToPx', #{expected_dt_ms});"

      actual_dx = page.evaluate_script """
        (function() {
          var transform = $('#timeline').find('#{selector}').attr('transform');
          return (transform && transform.length > 0) ? parseInt(transform.replace('translate(', ''), 10) : (-1234 + 48);
        })();
      """

      # No rounding
      actual_dx -= 48

      # Allow 5px variance for rounding errors
      delta = 5

      expect(expected_dx).to be_within(delta).of(actual_dx)
    end
    true
  end
end

RSpec::Matchers.define :have_focused_time_span do |start, stop|
  match do |page|
    expected_start_time = start.to_time.to_i * 1000
    expected_end_time = stop.to_time.to_i * 1000
    expected_start_px = page.evaluate_script "$('#timeline').timeline('timeToPosition', #{expected_start_time});"
    expected_end_px = page.evaluate_script "$('#timeline').timeline('timeToPosition', #{expected_end_time});"

    expect(page).to have_selector("rect[width^=\"#{(expected_start_px + 100000).to_i}\"]")
    expect(page).to have_selector("rect[x^=\"#{expected_end_px.to_i}\"]")
  end
end

RSpec::Matchers.define :have_temporal do |start, stop, range=nil, collection_n=nil|
  match do |page|
    condition = []
    condition << start.to_i
    condition << stop.to_i
    condition += range unless range.nil?

    script = "(function(temporal) {"
    script += "  return temporal.queryCondition();"

    if collection_n.nil?
      script += "})(edsc.page.query.temporal.applied);"
    else
      script += "})(edsc.page.project.collections()[#{collection_n}].granuleDatasource().temporal());"
    end

    synchronize do
      actual = page.evaluate_script(script).split(',')
      actual[0] = DateTime.parse(actual[0]).to_i
      actual[1] = DateTime.parse(actual[1]).to_i

      delta = (start.to_i - stop.to_i).abs / 100

      expect(actual.size).to eql(condition.size)

      expect(actual[0]).to be_within(delta).of(condition[0])
      expect(actual[1]).to be_within(delta).of(condition[1])

      if actual.size > 2
        expect(actual[2]).to eql(condition[2])
        expect(actual[3]).to eql(condition[2])
      end
    end
    true
  end

  failure_message_for_should do |page|
    script = "(function(temporal) {"
    script += "  return temporal.queryCondition();"

    if collection_n.nil?
      script += "})(edsc.page.query.temporal.applied);"
    else
      script += "})(edsc.page.project.collections()[#{collection_n}].granuleDatasource().temporal());"
    end

    actual = page.evaluate_script(script).split(',').join(' - ')

    "expected a temporal range of #{start} - #{stop}, got #{actual}"
  end
end


RSpec::Matchers.define :have_no_temporal do |collection_n=nil|
  match do |page|
    script = "(function(temporal) {"
    script += "  return temporal.queryCondition();"

    if collection_n.nil?
      script += "})(edsc.page.query.temporal.applied);"
    else
      script += "})(edsc.page.project.collections()[#{collection_n}].granuleDatasource().temporal());"
    end

    synchronize do
      actual = page.evaluate_script(script)
      expect(actual).to eql('')
    end
    true
  end
end
