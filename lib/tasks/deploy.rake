namespace :deploy do
  task pre: ['db:migrate', 'db:seed']
end
