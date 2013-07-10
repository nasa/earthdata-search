require 'deadweight'

Deadweight::RakeTask.new do |dw|
  dw.root = './'
  dw.stylesheets = Dir.glob('public/assets/**/*.css')
  dw.pages = ['doc/ui/index.html']
end
