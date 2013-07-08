require 'deadweight'

Deadweight::RakeTask.new do |dw|
  dw.root = './'
  dw.pages = ['doc/ui/index.html']
end
