namespace :deploy do
  task :pre => ['db:migrate', 'db:seed'] do
    require 'whenever'
    Whenever::CommandLine.execute(update: true)
  end
end
