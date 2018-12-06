require "spec_helper"

describe "Collection relevancy search" do
  # TODO: RDA // EDSC-1117 notes a bug in CMR that will cause this test to fail.
  xit "doesn't return collections that don't have granules falling in the set time range" do
    load_page :search, ff: 'Near Real Time', fpj: 'LANCE', fl: '1B - Radiance, Sensor Coordinates', facets: true
    set_temporal("2017-07-26 00:00:00", "2017-07-27 23:59:59")

    expect(page).to have_content('6 Matching Collections')
    expect(page).not_to have_content('MISR Near Real Time (NRT) Level 1B2 Ellipsoid Data V001')
    expect(page).not_to have_content('MISR Near Real Time (NRT) Level 1B2 Terrain Data V001')
    expect(page).not_to have_content('0 Granules')
  end
end
