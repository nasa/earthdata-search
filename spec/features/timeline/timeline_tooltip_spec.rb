require 'spec_helper'

describe "Timeline tooltip", reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search, project: ['C179003030-ORNL_DAAC'], view: :project
    wait_for_xhr
  end

  it "displays a tooltip for timeline data" do
    script = '$($(".C179003030-ORNL_DAAC.timeline-data").children()[1]).trigger("mouseover");'
    page.execute_script(script)

    expect(page).to have_content("01 Oct 1987 00:00 GMT to 05 Mar 1988 00:00 GMT")
  end
end
