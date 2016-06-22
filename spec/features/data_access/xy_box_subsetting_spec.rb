require "spec_helper"

describe "Data Access XY Box Subsetting", reset: false do
  reset_scope = :all

  before reset_scope do
    load_page :search
    login
    wait_for_xhr
  end

  context 'when ordering a collection with XY Box subsetting and a spatial constraint in the northern hemisphere' do
    before reset_scope do
      load_page :search, project: ['C115003855-NSIDC_ECS'], view: :project, bounding_box: [80, 0, 85, 10]
      login
      click_link "Retrieve project data"
      wait_for_xhr
    end

    context 'selecting the spatial subsetting option' do
      before reset_scope do
        choose 'M*D29P1D Order Option'
        check 'Check here for Subsetting Options'
        check 'Spatial Subsetting?'
      end

      it 'displays an option to subset to the spatial constraint' do
        expect(page).to have_field('Subset around my spatial search area')
      end

      it 'checks the option to subset to the spatial constraint by default' do
        expect(page).to have_checked_field('Subset around my spatial search area')
      end

      it 'shows the XY Box map projection dropdown' do
        expect(page).to have_select('Projections', disabled: true)
      end

      it 'populates the XY Box map projection dropdown' do
        expect(page).to have_select('Projections', disabled: true, selected: 'North EASE-Grid')
      end

      it 'disables the XY Box map projection dropdown' do
        expect(page).to have_selector('#XYBox .echoforms-control-select.ui-state-disabled', count: 1)
      end

      it 'populates the spatial coordinate fields' do
        expect(page).to have_field('Upper Left Row', disabled: true, with: '-1117892')
        expect(page).to have_field('Upper Left Column', disabled: true, with: '0')
        expect(page).to have_field('Lower Right Row', disabled: true, with: '-551042')
        expect(page).to have_field('Lower Right Column', disabled: true, with: '194120')
      end

      it 'disables the spatial coordinate fields' do
        expect(page).to have_selector('#XYBox .echoforms-control-input.ui-state-disabled', count: 4)
      end

      context 'un-checking the subset to spatial constraint box' do
        before reset_scope do
          uncheck 'Subset around my spatial search area'
        end

        after reset_scope do
          check 'Subset around my spatial search area'
        end

        it 'enables the XY Box map projection dropdown' do
          expect(page).to have_no_selector('#XYBox .echoforms-control-select.ui-state-disabled')
        end

        it 'enables the spatial coordinate fields' do
          expect(page).to have_no_selector('#XYBox .echoforms-control-input.ui-state-disabled')
        end
      end

      context 're-checking the subset to spatial constraint box' do
        before reset_scope do
          uncheck 'Subset around my spatial search area'
          select 'South EASE-Grid', from: 'Projections'
          fill_in 'Upper Left Row', with: '123'
          fill_in 'Upper Left Column', with: '123'
          fill_in 'Lower Right Row', with: '123'
          fill_in 'Lower Right Column', with: '123'
          check 'Subset around my spatial search area'
        end

        it 'resets the XY Box map projection dropdown' do
          expect(page).to have_select('Projections', disabled: true, selected: 'North EASE-Grid')
        end

        it 'disables the XY Box map projection dropdown' do
          expect(page).to have_selector('#XYBox .echoforms-control-select.ui-state-disabled', count: 1)
        end

        it 'resets the spatial coordinate fields' do
          expect(page).to have_field('Upper Left Row', disabled: true, with: '-1117892')
          expect(page).to have_field('Upper Left Column', disabled: true, with: '0')
          expect(page).to have_field('Lower Right Row', disabled: true, with: '-551042')
          expect(page).to have_field('Lower Right Column', disabled: true, with: '194120')
        end

        it 'disables the spatial coordinate fields' do
          expect(page).to have_selector('#XYBox .echoforms-control-input.ui-state-disabled', count: 4)
        end
      end
    end
  end

  context 'when ordering a collection with XY Box subsetting and a spatial constraint in the southern hemisphere' do
    before reset_scope do
      load_page :search, project: ['C115003855-NSIDC_ECS'], view: :project, point: [-80, 10]
      wait_for_xhr
      click_link "Retrieve project data"
      wait_for_xhr
    end

    context 'selecting the spatial subsetting option' do
      before reset_scope do
        choose 'M*D29P1D Order Option'
        check 'Check here for Subsetting Options'
        check 'Spatial Subsetting?'
      end

      it 'displays an option to subset to the spatial constraint' do
        expect(page).to have_field('Subset around my spatial search area')
      end

      it 'checks the option to subset to the spatial constraint by default' do
        expect(page).to have_checked_field('Subset around my spatial search area')
      end

      it 'shows the XY Box map projection dropdown' do
        expect(page).to have_select('Projections', disabled: true)
      end

      it 'populates the XY Box map projection dropdown' do
        expect(page).to have_select('Projections', disabled: true, selected: 'South EASE-Grid')
      end

      it 'disables the XY Box map projection dropdown' do
        expect(page).to have_selector('#XYBox .echoforms-control-select.ui-state-disabled', count: 1)
      end

      it 'populates the spatial coordinate fields' do
        expect(page).to have_field('Upper Left Row', disabled: true, with: '1100908')
        expect(page).to have_field('Upper Left Column', disabled: true, with: '194120')
        expect(page).to have_field('Lower Right Row', disabled: true, with: '1100908')
        expect(page).to have_field('Lower Right Column', disabled: true, with: '194120')
      end

      it 'disables the spatial coordinate fields' do
        expect(page).to have_selector('#XYBox .echoforms-control-input.ui-state-disabled', count: 4)
      end

      context 'un-checking the subset to spatial constraint box' do
        before reset_scope do
          uncheck 'Subset around my spatial search area'
        end

        after reset_scope do
          check 'Subset around my spatial search area'
        end

        it 'enables the XY Box map projection dropdown' do
          expect(page).to have_no_selector('#XYBox .echoforms-control-select.ui-state-disabled')
        end

        it 'enables the spatial coordinate fields' do
          expect(page).to have_no_selector('#XYBox .echoforms-control-input.ui-state-disabled')
        end
      end

      context 're-checking the subset to spatial constraint box' do
        before reset_scope do
          uncheck 'Subset around my spatial search area'
          select 'South EASE-Grid', from: 'Projections'
          fill_in 'Upper Left Row', with: '123'
          fill_in 'Upper Left Column', with: '123'
          fill_in 'Lower Right Row', with: '123'
          fill_in 'Lower Right Column', with: '123'
          check 'Subset around my spatial search area'
        end

        it 'resets the XY Box map projection dropdown' do
          expect(page).to have_select('Projections', disabled: true, selected: 'South EASE-Grid')
        end

        it 'disables the XY Box map projection dropdown' do
          expect(page).to have_selector('#XYBox .echoforms-control-select.ui-state-disabled', count: 1)
        end

        it 'resets the spatial coordinate fields' do
          expect(page).to have_field('Upper Left Row', disabled: true, with: '1100908')
          expect(page).to have_field('Upper Left Column', disabled: true, with: '194120')
          expect(page).to have_field('Lower Right Row', disabled: true, with: '1100908')
          expect(page).to have_field('Lower Right Column', disabled: true, with: '194120')
        end

        it 'disables the spatial coordinate fields' do
          expect(page).to have_selector('#XYBox .echoforms-control-input.ui-state-disabled', count: 4)
        end
      end
    end
  end

  context 'when ordering a collection with XY Box subsetting and a spatial constraint near the equator' do
    before reset_scope do
      load_page :search, project: ['C115003855-NSIDC_ECS'], view: :project, bounding_box: [10, 0, 80, 10]
      wait_for_xhr
      click_link "Retrieve project data"
      wait_for_xhr
    end

    context 'selecting the spatial subsetting option' do
      before reset_scope do
        choose 'M*D29P1D Order Option'
        check 'Check here for Subsetting Options'
        check 'Spatial Subsetting?'
      end

      it 'displays no option to subset using the spatial constraint' do
        expect(page).to have_no_field('Subset around my spatial search area')
      end

      it 'shows the XY Box map projection dropdown' do
        expect(page).to have_select('Projections')
      end

      it 'enables the XY Box map projection dropdown' do
        expect(page).to have_no_selector('#XYBox .echoforms-control-select.ui-state-disabled')
      end

      it 'enables the spatial coordinate fields' do
        expect(page).to have_no_selector('#XYBox .echoforms-control-input.ui-state-disabled')
      end
    end
  end

  context 'when ordering a collection with XY Box subsetting and no spatial constraint' do
    before reset_scope do
      load_page :search, project: ['C115003855-NSIDC_ECS'], view: :project, bounding_box: [10, 0, 80, 10]
      wait_for_xhr
      click_link "Retrieve project data"
      wait_for_xhr
    end

    context 'selecting the spatial subsetting option' do
      before reset_scope do
        choose 'M*D29P1D Order Option'
        check 'Check here for Subsetting Options'
        check 'Spatial Subsetting?'
      end

      it 'displays no option to subset using the spatial constraint' do
        expect(page).to have_no_field('Subset around my spatial search area')
      end

      it 'shows the XY Box map projection dropdown' do
        expect(page).to have_select('Projections')
      end

      it 'enables the XY Box map projection dropdown' do
        expect(page).to have_no_selector('#XYBox .echoforms-control-select.ui-state-disabled')
      end

      it 'enables the spatial coordinate fields' do
        expect(page).to have_no_selector('#XYBox .echoforms-control-input.ui-state-disabled')
      end
    end
  end
end
