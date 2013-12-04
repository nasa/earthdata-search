unless Rails.env.production?
  namespace :test do
    require 'deadweight'

    desc "Run deadweight to discover CSS rules that are not exercised in the pattern portfolio"
    task :deadweight => 'doc:ui'
    Deadweight::RakeTask.new do |dw|
      dw.root = './'
      dw.stylesheets = Dir.glob('public/assets/**/*.css')
      dw.ignore_selectors = /^\.(fa|leaflet)(\.|-|$).*/
      dw.pages = ['doc/ui/index.html']
    end
  end
end
