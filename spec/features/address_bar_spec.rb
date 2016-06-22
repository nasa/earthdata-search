# EDSC-147 - EDSC-153: Persisting sessions and bookmarks

require 'spec_helper'

describe 'Address bar', reset: false do
  def query_string
    URI.parse(current_url).query
  end

  context 'when loading collection details page from search page' do
    before :all do
      visit '/search'
      wait_for_xhr
      first_collection_result.click_link('View collection details')
      wait_for_xhr
    end

    it 'saves "collection-details" in the address bar' do
      expect(page).to have_path('/search/collection-details')
    end
  end

  context 'when searching by keywords' do
    before(:all) do
      visit '/search/map'
      wait_for_xhr
      fill_in "keywords", with: 'C1219032686-LANCEMODIS'
    end

    it 'saves the keyword condition in the address bar' do
      expect(page).to have_query_string('q=C1219032686-LANCEMODIS')
    end

    context 'clearing filters' do
      before(:all) { click_link "Clear Filters" }

      it 'removes the keyword condition from the address bar' do
        expect(page).to have_query_string(nil)
      end
    end
  end

  context 'when loading a url containing a temporal condition' do
    before(:all) { visit '/search/collections?q=C1219032686-LANCEMODIS' }

    it 'loads the condition into the keywords field' do
      expect(page).to have_field('keywords', with: 'C1219032686-LANCEMODIS')
    end

    it 'filters collections using the condition' do
      expect(page).to have_content('MYD04_L2')
    end
  end

  context 'when searching by temporal' do
    before(:all) do
      visit '/search/map'
      wait_for_xhr
      click_link "Temporal"
      js_check_recurring "collection"
      fill_in "Start", with: "12-01 00:00:00\t"
      fill_in "End", with: "12-31 00:00:00\t"
      script = "edsc.page.query.temporal.pending.years([1970, 1975])"
      page.execute_script(script)
      wait_for_xhr
      js_click_apply ".temporal-dropdown"
      wait_for_xhr
    end

    it 'saves the temporal condition in the address bar' do
      expect(page).to have_query_string('qt=1970-12-01T00%3A00%3A00.000Z%2C1975-12-31T00%3A00%3A00.000Z%2C335%2C365')
    end

    context 'clearing filters' do
      before(:all) do
        # Temporal dropdown causes capybara to throw persistent fits of ClickFailed errors, so we do this with JS.
        page.execute_script('$(".clear-filters").click()')
      end

      it 'removes the temporal condition from the address bar' do
        expect(page).to have_query_string(nil)
      end
    end
  end

  context 'when loading a url containing a temporal condition' do
    before(:all) { visit '/search/collections?qt=1970-12-01T00%3A00%3A00.000Z%2C1975-12-31T00%3A00%3A00.000Z%2C335%2C365' }

    it 'loads the condition into the temporal fields' do
      click_link "Temporal"
      within('.temporal-dropdown') do
        expect(page).to have_checked_field('Recurring?')
        expect(page).to have_field('Start', with: '12-01 00:00:00')
        expect(page).to have_field('End', with: '12-31 00:00:00')
        expect(page).to have_text('Range: 1970 - 1975')
      end
    end

    it 'displays the temporal on the map' do
      expect(page.find('#temporal-query')).to have_text('Start 12-01 00:00:00 Stop 12-31 00:00:00 Range 1970 - 1975')
    end

    it 'filters collections using the condition' do
      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("A Global Database of Carbon and Nutrient Concentrations of Green and Senesced Leaves")
    end
  end

  context 'when searching by spatial' do
    before(:all) do
      visit '/search/map'
      wait_for_xhr
      create_bounding_box(0, 0, 10, 10)
    end

    it 'saves the spatial condition in the address bar' do
      expect(page).to have_query_string('sb=0%2C0%2C10%2C10')
    end

    context 'clearing filters' do
      before(:all) { click_link "Clear Filters" }

      it 'removes the spatial condition from the address bar' do
        expect(page).to have_query_string(nil)
      end
    end
  end

  context 'when loading a url containing a spatial condition' do
    before(:all) { visit '/search/collections?sb=0%2C0%2C10%2C10' }

    it 'draws the condition on the map' do
      expect(page).to have_selector('#map path', count: 1)
    end

    it 'filters collections using the condition' do
      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("A Compilation of Global Soil Microbial Biomass Carbon, Nitrogen, and Phosphorus Data")
    end
  end

  context 'when searching by facets' do
    before(:all) do
      visit '/search?test_facets=true'
      find("h3.facet-title", text: 'Project').click
      find(".facets-item", text: "EOSDIS").click
      wait_for_xhr
    end

    it 'saves the facet condition in the address bar' do
      expect(page).to have_query_string('test_facets=true&fpj=EOSDIS')
    end

    context 'clearing filters' do
      before(:all) { click_link "Clear Filters" }

      it 'removes the facet condition from the address bar' do
        expect(page).to have_query_string('test_facets=true')
      end
    end
  end

  context 'when loading a url containing a facet condition' do
    before(:all) { visit '/search?test_facets=true&fpj=EOSDIS' }

    it 'displays the selected facet condition' do
      within(:css, '#collapse2 .panel-body.facets') do
        expect(page).to have_content("EOSDIS")
        expect(page).to have_css(".facets-item.selected")
      end
    end

    it 'filters collections using the condition' do
      expect(page).to have_no_text('2000 Pilot Environmental Sustainability Index (ESI)')
    end
  end

  context 'when adding collections to a project' do
    before(:all) do
      visit '/search/collections'
      add_collection_to_project('C179001887-SEDAC', '2000 Pilot Environmental Sustainability Index (ESI)')
      add_collection_to_project('C179002914-ORNL_DAAC', '30 Minute Rainfall Data (FIFE)')
      click_link "Clear Filters"
    end

    it 'saves the project in the address bar' do
      expect(page).to have_query_string('p=!C179001887-SEDAC!C179002914-ORNL_DAAC')
    end
  end

  context 'when loading a url containing project collections' do
    before(:all) { visit '/search/project?p=!C179001887-SEDAC!C179002914-ORNL_DAAC' }

    it 'restores the project' do
      expect(page).to have_visible_project_overview
      expect(project_overview).to have_text('2000 Pilot Environmental Sustainability Index (ESI)')
      expect(project_overview).to have_text('30 Minute Rainfall Data (FIFE)')
    end
  end

  context "when viewing a collection's granules" do
    before(:all) do
      visit '/search/collections?q=C179003030-ORNL_DAAC'
      view_granule_results
    end

    it 'saves the selected collection in the address bar' do
      expect(page).to have_query_string('p=C179003030-ORNL_DAAC&q=C179003030-ORNL_DAAC')
    end
  end

  context "when loading a url containing a collection's granules" do
    before(:all) { visit '/search/granules?p=C179003030-ORNL_DAAC' }

    it 'restores the collection granules view' do
      expect(page).to have_visible_granule_list
      expect(granule_list).to have_text('15 Minute Stream Flow')
    end
  end

  context "when viewing a collection's details" do
    before(:all) do
      visit '/search/collections?q=C179003030-ORNL_DAAC'
      first_collection_result.click_link('View collection details')
    end

    it 'saves the selected collection in the address bar' do
      expect(page).to have_query_string('p=C179003030-ORNL_DAAC&q=C179003030-ORNL_DAAC')
    end
  end

  context "when loading a url containing a collection's details" do
    before(:all) { visit '/search/collection-details?p=C179003030-ORNL_DAAC' }

    it 'restores the collection details view' do
      expect(page).to have_visible_collection_details
      expect(collection_details).to have_text('15 Minute Stream Flow')
    end
  end

  context "when viewing a granule's details" do
    before :all do
      visit '/search/collections?q=C179003030-ORNL_DAAC'
      wait_for_xhr
      first_collection_result.click
      wait_for_xhr
      first_granule_list_item.click_link 'View granule details'
      wait_for_xhr
    end

    it 'saves the selected granule in the address bar' do
      expect(page).to have_query_string('p=C179003030-ORNL_DAAC&g=G179111301-ORNL_DAAC&m=39.1019!-97.72!7!1!0!0%2C2&q=C179003030-ORNL_DAAC')
    end
  end

  context "when loading a url containing a granule's details" do
    before :all do
      visit '/search/granules/granule-details?p=C179003030-ORNL_DAAC&g=G179111301-ORNL_DAAC'
      wait_for_xhr
    end

    it "restores the granule details view" do
      expect(page).to have_visible_granule_details
      expect(granule_details).to have_text('FIFE_STRM_15M.80611715.s15')
    end
  end

  context "setting granule query conditions within the project" do
    before(:all) do
      visit '/search/project?p=!C179003030-ORNL_DAAC!C179002914-ORNL_DAAC'
      first_project_collection.click_link "Show granule filters"
      check "Find only granules that have browse images."
      second_project_collection.click_link "Show granule filters"
      select 'Day only', from: "day-night-select"
      second_project_collection.click_link "Hide granule filters"
      first_project_collection.click_link "View collection details"
      wait_for_xhr
      expect(page).to have_visible_collection_details
    end

    it "saves the query conditions in the URL" do
      expect(page).to have_path('/search/project/collection-details')
      expect(page).to have_query_string('p=C179003030-ORNL_DAAC!C179003030-ORNL_DAAC!C179002914-ORNL_DAAC&pg[1][bo]=true&pg[2][dnf]=DAY')
    end

    it "does not duplicate the query conditions for the focused collection" do
      expect(page.current_url).not_to include('pg[0][bo]')
    end
  end

  context "setting granule query conditions when the focused collection is not the project" do
    before(:all) do
      visit '/search/granules?p=C179003030-ORNL_DAAC!C179002914-ORNL_DAAC'
      click_link "Filter granules"
      check "Find only granules that have browse images."
      wait_for_xhr
    end

    it "saves the query conditions in the URL" do
      expect(page).to have_query_string('p=C179003030-ORNL_DAAC!C179002914-ORNL_DAAC&pg[0][bo]=true')
    end

    it "includes query conditions for the focused collection" do
      expect(page.current_url).to include('pg[0][bo]')
    end
  end

  context "loading a URL with saved query conditions" do
    before :all do
      visit '/search/project?p=C179003030-ORNL_DAAC!C179003030-ORNL_DAAC!C179002914-ORNL_DAAC&pg[1][bo]=true&pg[2][dnf]=DAY'
      wait_for_xhr
    end

    it "restores the granule query conditions" do
      first_project_collection.click_link "Show granule filters"
      expect(page).to have_checked_field 'Find only granules that have browse images.'
      second_project_collection.click_link "Show granule filters"
      expect(page).to have_select 'day-night-select', selected: 'Day only'
    end
  end

  context "when panning and zooming the map" do
    before(:all) do
      visit '/search/map'
      wait_for_xhr
      page.execute_script("$('#map').data('map').map.setView(L.latLng(12, -34), 5)")
      wait_for_zoom_animation(5)
      wait_for_xhr
    end

    it "saves the map state in the query conditions" do
      expect(page).to have_query_string('m=12!-34!5!1!0!0%2C2')
    end
  end

  context "when loading a url with a saved map state" do
    before(:all) do
      visit '/search/map?m=12!-34!5!1'
    end

    it "restores the map pan state from the query conditions" do
      synchronize do
        lat = page.evaluate_script("$('#map').data('map').map.getCenter().lat")
        lng = page.evaluate_script("$('#map').data('map').map.getCenter().lng")
        expect(lat).to eql(12)
        expect(lng).to eql(-34)
      end
    end

    it "restores the map zoom state from the query conditions" do
      synchronize do
        zoom = page.evaluate_script("$('#map').data('map').map.getZoom()")
        expect(zoom).to eql(5)
      end
    end
  end

  present = DateTime.new(2014, 3, 1, 0, 0, 0, '+0')

  context "when panning the timeline" do
    before(:all) do
      visit '/search/granules?p=C179003030-ORNL_DAAC'
      wait_for_xhr
      pan_to_time(present - 20.years)
      wait_for_xhr
    end

    it 'saves the timeline pan state in the URL' do
      expect(page).to have_query_string('p=C179003030-ORNL_DAAC&tl=746668800!4!!')
    end
  end

  context "when selecting a timeline date" do
    before(:all) do
      visit '/search/granules?p=C179003030-ORNL_DAAC'
      wait_for_xhr
      click_timeline_date('Nov', '1987')
      wait_for_xhr
    end

    it 'saves the timeline date selection in the URL' do
      expect(page).to have_query_string('p=C179003030-ORNL_DAAC&tl=557625600!4!562723200!565315199')
    end
  end

  context "when zooming the timeline" do
    before(:all) do
      visit '/search/granules?p=C179003030-ORNL_DAAC'
      wait_for_xhr
      find('.timeline-zoom-out').click
      wait_for_xhr
    end

    it 'saves the timeline zoom level' do
      expect(page).to have_query_string('p=C179003030-ORNL_DAAC&tl=557625600!5!!')
    end
  end

  context "when loading a URL with a saved timeline state" do
    before(:all) do
      visit '/search/granules?p=C179003030-ORNL_DAAC&tl=604713600!5!536457600!567993600'
      wait_for_xhr
    end

    it "restores the timeline pan state" do
      expect(page).to have_timeline_range(present - 30.years, present - 20.years)
    end

    it "restores the timeline zoom state" do
      expect(page).to have_selector('.timeline-tools h1', text: 'YEAR')
    end

    it "restores the selected timeline date" do
      start_1987 = DateTime.new(1987, 1, 1, 0, 0, 0, '+0')
      start_1988 = DateTime.new(1988, 1, 1, 0, 0, 0, '+0')
      expect(page).to have_focused_time_span(start_1987, start_1988)
    end
  end

  context "when selecting a granule" do
    before(:all) do
      visit '/search/granules?p=C179003030-ORNL_DAAC'
      wait_for_xhr
      second_granule_list_item.click
      wait_for_xhr
    end

    it "saves the selected granule in the URL" do
      expect(page).to have_query_string('p=C179003030-ORNL_DAAC&g=G179111300-ORNL_DAAC&m=39.1019!-97.72!7!1!0!0%2C2')
    end
  end

  context "when loading a URL with a selected granule" do
    before(:all) do
      visit '/search/granules?p=C179003030-ORNL_DAAC&g=G179111300-ORNL_DAAC'
    end

    it "restores the granule selection in the granules list" do
      expect(page).to have_css('.panel-list-list li:nth-child(2).panel-list-selected')
    end

    it "restores the granule selection on the map" do
      expect(page.find('#map')).to have_text('1988-02-01T00:00:00Z')
    end
  end

  context "Long URLs" do
    let(:long_path) { '/search/collections?p=!C179001887-SEDAC!C1000000220-SEDAC!C179001967-SEDAC!C179001889-SEDAC!C179001707-SEDAC&q=C179003030-ORNL_DAAC' }
    let(:longer_path) { long_path.gsub('&', '!C179003030-ORNL_DAAC&') }
    let(:query_re) { /^projectId=(\d+)$/ }

    def query
      URI.parse(page.current_url).query
    end

    def project_id
      query[query_re, 1].to_i
    end

    context "when the site URL grows beyond the allowable limit" do
      # Each to avoid database cleanup problems
      before(:each) do
        visit long_path
        wait_for_xhr
        target_collection_result.click_link('Add collection to the current project')
        wait_for_xhr
      end

      it "stores the URL remotely and provides a shortened URL" do
        expect(query).to match(query_re)
        expect(Project.find(project_id).path).to eql(longer_path)
      end

      context "further updating the page state" do
        before_project_id = nil

        before(:each) do
          before_project_id = project_id
          fill_in "keywords", with: 'AST'
          wait_for_xhr
        end

        it "keeps the URL the same but updates the remote store" do
          expect(Project.find(project_id).path).to eql(longer_path.gsub(/C179003030-ORNL_DAAC$/, 'AST'))
          expect(before_project_id).to eql(project_id)
        end
      end
    end

    context "loading a shortened URL" do
      before(:each) do
        project = Project.new
        project.path = longer_path
        project.save!

        visit "/search/collections?projectId=#{project.to_param}"
        wait_for_xhr
      end

      it "restores the persisted long path" do
        expect(page).to have_text('You have 6 collections in your project.')
      end
    end
  end


  context 'when the labs parameter is set to true' do
    context 'the granule filters panel' do
      before(:all) do
        visit "/search/granules?labs=true&p=C14758250-LPDAAC_ECS"
        click_on 'Filter granules'
      end

      it 'shows a section for additional attribute search' do
        expect(page).to have_text('Collection-Specific Attributes')
      end

      it 'shows additional attribute search fields' do
        expect(page).to have_field('ASTERMapProjection')
      end
    end
  end

  context 'when the labs parameter not set' do
    context 'the granule filters panel' do
      before(:all) do
        visit "/search/granules?p=C14758250-LPDAAC_ECS"
        click_on 'Filter granules'
      end

      it 'shows no section for additional attribute search' do
        expect(page).to have_no_text('Collection-Specific Attributes')
      end

      it 'shows no additional attribute search fields' do
        expect(page).to have_no_field('ASTERMapProjection')
      end
    end
  end

  context 'when changing the base layer' do
    before :all do
      visit '/search'
      wait_for_xhr
      page.find_link('Layers').trigger(:mouseover)
      within '#map' do
        choose 'Land / Water Map'
      end
      wait_for_xhr
    end

    it 'saves the base layer in the url' do
      expect(page).to have_query_string('m=0!0!2!1!2!0%2C2')
    end

    context 'when refreshing the page' do
      before :all do
        visit '/search?m=0!0!2!1!2!'
        wait_for_xhr
      end

      it 'remembers the base layer' do
        expect('#map').to have_tiles_for_product('OSM_Land_Water_Map')
      end
    end
  end

  context 'when changing the map overlays' do
    before :all do
      visit '/search'
      wait_for_xhr
      page.find_link('Layers').trigger(:mouseover)
      within '#map' do
        check 'Borders and Roads'
        check 'Coastlines'
      end
      wait_for_xhr
    end

    it 'saves the applied overlays in the url' do
      expect(page).to have_query_string('m=0!0!2!1!0!0%2C2%2C1')
    end

    context 'when refreshing the page' do
      before :all do
        visit '/search?m=0!0!2!1!0!0%2C1'
        wait_for_xhr
      end

      it 'remembers the applied overlays' do
        expect('#map').to have_tiles_for_product('Reference_Features')
        expect('#map').to have_tiles_for_product('Reference_Labels')
      end
    end
  end

end
