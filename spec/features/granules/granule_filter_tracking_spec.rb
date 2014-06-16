# EDSC-82: As a user, I want to be warned when changing my granule filters may
#          cause undesirable behavior with my removed granules

require "spec_helper"

describe "Granule filter tracking", reset: false do

  has_reference_script = """
    (function(id) {
      var ds = window.edsc.models.data.Dataset.findOrCreate({id: id}, null);
      ds.dispose();
      return ds.links != null;
    })('C179003030-ORNL_DAAC');
  """

  context 'when granule filters have been set for a dataset' do
    before :all do
      load_page :search, project: ['C179003030-ORNL_DAAC'], queries: [nil, {browse_only: true}]
      wait_for_xhr
    end

    context 'completely removing the dataset from all views' do
      before :all do
        first_dataset_result.click_link "Remove dataset from the current project"
        fill_in :keywords, with: 'asdfasdfasdfasdfasdf'
        wait_for_xhr
      end

      it 'maintains information on the dataset' do
        synchronize do
          has_reference = page.evaluate_script(has_reference_script)
          expect(has_reference).to be_true
        end
      end

      context 'and locating the dataset again' do
        before :all do
          click_on 'Clear Filters'
          wait_for_xhr
        end

        it 'restores the original granule filters that had been set' do
          synchronize do
            has_reference = page.evaluate_script(has_reference_script)
            expect(has_reference).to be_true
          end
        end
      end
    end
  end

  context 'when no granule filters have been set for a dataset' do
    before :all do
      load_page :search, project: ['C179003030-ORNL_DAAC']
      wait_for_xhr
    end

    context 'completely removing the dataset from all views' do
      before :all do
        first_dataset_result.click_link "Remove dataset from the current project"
        fill_in :keywords, with: 'asdfasdfasdfasdfasdf'
        wait_for_xhr
      end

      after :all do
        load_page :search, project: ['C179003030-ORNL_DAAC']
        wait_for_xhr
      end

      it 'forgets the dataset' do
        synchronize do
          has_reference = page.evaluate_script(has_reference_script)
          expect(has_reference).to be_false
        end
      end
    end
  end
end
