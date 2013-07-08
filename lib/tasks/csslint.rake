require 'csslint/testtask'

CSSLint::TestTask.new do |t|
  t.file_list = Dir['public/assets/**/*.css']
  t.options = {
    # ...
  }
end
# Rake::Task[:test].enhance(['jslint'])
