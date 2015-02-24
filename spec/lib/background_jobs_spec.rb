require 'spec_helper'
require 'rake'

describe 'Background Jobs Rake Task' do
  before :all do
    Rake.application.rake_require "tasks/background_jobs"
    Rake::Task.define_task(:environment)
    run_stop_task
  end

  context 'background_jobs:check with no processes running' do
    before :each do
      run_check_task
    end

    after :all do
      run_stop_task
    end

    it "should start a process" do
      expect(check_process).to eq(1)
    end

    context 'background_jobs:check with processes running' do
      before :each do
        run_check_task
      end

      it "should still have a process running" do
        expect(check_process).to eq(1)
      end
    end
  end

  context 'background_jobs:stop' do
    before :each do
      run_check_task
    end

    after :all do
      run_stop_task
    end

    it 'stops the running process' do
      run_stop_task
      expect(check_process).to eq(0)
    end
  end
end
