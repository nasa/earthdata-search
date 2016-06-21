require 'knapsack'

# Generates more accurate reports for knapsack by timing :all blocks
class TimingAdapter < Knapsack::Adapters::RspecAdapter
  def bind_time_tracker
    ::RSpec.configure do |config|
      config.before(:all) do
        Knapsack.tracker.test_path = self.class.metadata[:example_group][:file_path]
        Knapsack.tracker.start_timer
      end

      config.after(:all) do
        Knapsack.tracker.stop_timer
      end

      config.after(:suite) do
        Knapsack.logger.info(Knapsack::Presenter.global_time)
      end
    end
  end
end

TimingAdapter.bind
