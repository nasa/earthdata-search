require "spec_helper"

describe "Project dataset dragging", reset: false do
  first_dataset_id = 'C179002914-ORNL_DAAC'
  first_dataset_title = "30 Minute Rainfall Data (FIFE)"
  first_color_rgb = 'rgb(52, 152, 219)'
  second_dataset_id = 'C179003030-ORNL_DAAC'
  second_dataset_title = "15 Minute Stream Flow Data: USGS (FIFE)"
  second_color_rgb = 'rgb(230, 126, 34)'

  def drag_dataset(start_index, end_index)
    wait_for_xhr

    script = """
      (function() {
        $('#project-datasets-list').trigger('sortupdate', {startIndex: #{start_index}, endIndex: #{end_index}});
      })();
    """
    page.execute_script script
    wait_for_xhr
  end

  context "dragging and dropping a dataset to a new position" do
    before :all do
      load_page :search, project: [first_dataset_id, second_dataset_id], view: :project
      drag_dataset(0, 1)
      click_on 'View all datasets'
    end

    it "updates the order of the datasets in the datasets list" do
      expect(first_project_dataset).to have_text(second_dataset_title)
      expect(second_project_dataset).to have_text(first_dataset_title)
    end

    it "updates the order of the datasets in the timeline" do
      expect(page.find('.timeline-dataset')).to have_text("#{second_dataset_title}#{first_dataset_title}")
    end

    it "updates the z-index of the datasets visualized on the map" do
      expect(page).to have_selector("#granule-vis-#{second_dataset_id}[style*=\"z-index: 16\"]")
      expect(page).to have_selector("#granule-vis-#{first_dataset_id}[style*=\"z-index: 17\"]")
    end

    it "persists the new order in the URL parameters" do
      expect(page).to have_query_string("p=!#{second_dataset_id}!#{first_dataset_id}&p1[v]=&p2[v]=")
    end

    it "keeps dataset color assignments the same" do
      expect(second_project_dataset).to have_css("*[style*=\"#{first_color_rgb}\"]")
      expect(first_project_dataset).to have_css("*[style*=\"#{second_color_rgb}\"]")
    end
  end

  context "dragging and dropping a dataset to its original position" do
    before :all do
      load_page :search, project: [first_dataset_id, second_dataset_id], view: :project
      drag_dataset(0, 0)
      click_on 'View all datasets'
    end

    it "maintains the order of the datasets in the datasets list" do
      expect(first_project_dataset).to have_text(first_dataset_title)
      expect(second_project_dataset).to have_text(second_dataset_title)
    end

    it "maintains the order of the datasets in the timeline" do
      expect(page.find('.timeline-dataset')).to have_text("#{first_dataset_title}#{second_dataset_title}")
    end

    it "maintains the z-index of the datasets visualized on the map" do
      expect(page).to have_selector("#granule-vis-#{first_dataset_id}[style*=\"z-index: 16\"]")
      expect(page).to have_selector("#granule-vis-#{second_dataset_id}[style*=\"z-index: 17\"]")
    end

    it "maintains the dataset order in the URL parameters" do
      expect(page).to have_query_string("p=!#{first_dataset_id}!#{second_dataset_id}&p1[v]=&p2[v]=")
    end

    it "keeps dataset color assignments the same" do
      expect(first_project_dataset).to have_css("*[style*=\"#{first_color_rgb}\"]")
      expect(second_project_dataset).to have_css("*[style*=\"#{second_color_rgb}\"]")
    end
  end
end
