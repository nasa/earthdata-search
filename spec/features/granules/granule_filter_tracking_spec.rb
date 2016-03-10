# EDSC-82: As a user, I want to be warned when changing my granule filters may
#          cause undesirable behavior with my removed granules

require "spec_helper"

describe "Granule filter tracking", reset: false do

  has_reference_script = """
    (function(id) {
      var ds = window.edsc.models.data.Collection.findOrCreate({id: id}, null);
      ds.dispose();
      return ds.links != null;
    })('C179003030-ORNL_DAAC');
  """

  context 'when granule filters have been set for a collection' do
    before :all do
      load_page :search, q: 'C179003030-ORNL_DAAC', project: ['C179003030-ORNL_DAAC'], queries: [nil, {bo: true}]
      wait_for_xhr
    end

    context 'completely removing the collection from all views' do
      before :all do
        target_collection_result.click_link "Remove collection from the current project"
        fill_in :keywords, with: 'asdfasdfasdfasdfasdf'
        wait_for_xhr
      end

      it 'maintains information on the collection' do
        synchronize do
          has_reference = page.evaluate_script(has_reference_script)
          expect(has_reference).to be_true
        end
      end

      context 'and locating the collection again' do
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

  context 'when no granule filters have been set for a collection' do
    before :all do
      load_page :search, q: 'C179003030-ORNL_DAAC', project: ['C179003030-ORNL_DAAC']
      wait_for_xhr
    end

    context 'completely removing the collection from all views' do
      before :all do
        target_collection_result.click_link "Remove collection from the current project"
        fill_in :keywords, with: 'asdfasdfasdfasdfasdf'
        wait_for_xhr
      end

      after :all do
        load_page :search, project: ['C179003030-ORNL_DAAC']
        wait_for_xhr
      end

      it 'forgets the collection' do
        synchronize do
          has_reference = page.evaluate_script(has_reference_script)
          expect(has_reference).to be_false
        end
      end
    end
  end
end
