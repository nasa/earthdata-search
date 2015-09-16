namespace :scheduler do
  task :run => ['environment'] do
    require 'rufus-scheduler'
    require 'colormaps/xml_to_json'

    scheduler = Rufus::Scheduler.new

    scheduler.every '1h' do
      DatasetExtra.load_echo10
      DatasetExtra.load
    end

    scheduler.every '1d' do
      Colormaps.load
    end

    scheduler.join
  end
end
