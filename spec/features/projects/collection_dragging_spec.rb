require "spec_helper"

describe "Project collection dragging", reset: false do
  first_collection_id = 'C179002914-ORNL_DAAC'
  first_collection_title = "30 Minute Rainfall Data (FIFE)"
  first_color_rgb = 'rgb(52, 152, 219)'
  second_collection_id = 'C179003030-ORNL_DAAC'
  second_collection_title = "15 Minute Stream Flow Data: USGS (FIFE)"
  second_color_rgb = 'rgb(230, 126, 34)'

  def drag_collection(start_index, end_index)
    wait_for_xhr

    script = """
      (function() {
        $('#project-collections-list').trigger('sortupdate', {startIndex: #{start_index}, endIndex: #{end_index}});
      })();
    """
    page.execute_script script
    wait_for_xhr
  end

  context "dragging and dropping a collection to a new position" do
    before :all do
      load_page :search, project: [first_collection_id, second_collection_id], view: :project
      drag_collection(0, 1)
      click_on 'View all collections'
    end

    it "updates the order of the collections in the collections list" do
      expect(first_project_collection).to have_text(second_collection_title)
      expect(second_project_collection).to have_text(first_collection_title)
    end

    it "updates the order of the collections in the timeline" do
      expect(page.find('.timeline-row')).to have_text("#{second_collection_title}#{first_collection_title}")
    end

    it "updates the z-index of the collections visualized on the map" do
      expect(page).to have_selector("#granule-vis-#{second_collection_id}[style*=\"z-index: 16\"]")
      expect(page).to have_selector("#granule-vis-#{first_collection_id}[style*=\"z-index: 17\"]")
    end

    it "persists the new order in the URL parameters" do
      expect(page).to have_query_string("p=!#{second_collection_id}!#{first_collection_id}&pg[1][v]=t&pg[2][v]=t")
    end

    it "keeps collection color assignments the same" do
      expect(second_project_collection).to have_css("*[style*=\"#{first_color_rgb}\"]")
      expect(first_project_collection).to have_css("*[style*=\"#{second_color_rgb}\"]")
    end
  end

  context "dragging and dropping a collection to its original position" do
    before :all do
      load_page :search, project: [first_collection_id, second_collection_id], view: :project
      drag_collection(0, 0)
      click_on 'View all collections'
    end

    it "maintains the order of the collections in the collections list" do
      expect(first_project_collection).to have_text(first_collection_title)
      expect(second_project_collection).to have_text(second_collection_title)
    end

    it "maintains the order of the collections in the timeline" do
      expect(page.find('.timeline-row')).to have_text("#{first_collection_title}#{second_collection_title}")
    end

    it "maintains the z-index of the collections visualized on the map" do
      expect(page).to have_selector("#granule-vis-#{first_collection_id}[style*=\"z-index: 16\"]")
      expect(page).to have_selector("#granule-vis-#{second_collection_id}[style*=\"z-index: 17\"]")
    end

    it "maintains the collection order in the URL parameters" do
      expect(page).to have_query_string("p=!#{first_collection_id}!#{second_collection_id}&pg[1][v]=t&pg[2][v]=t")
    end

    it "keeps collection color assignments the same" do
      expect(first_project_collection).to have_css("*[style*=\"#{first_color_rgb}\"]")
      expect(second_project_collection).to have_css("*[style*=\"#{second_color_rgb}\"]")
    end
  end
end
