namespace :node do
  desc 'compile node.js assets'
  task :compile do
    unless ENV['skip_node_compile'] == 'true'
      puts `npm install`
      raise 'Could not precompile node.js assets. Try running `npm install`' unless $? == 0
      # Clean up huge amount of files pulled by npm install on deployment
      puts `rm -rf ./node_modules` if `pwd`.start_with?('/data/rails')
    end
  end
end

Rake::Task['assets:precompile'].enhance ['node:compile']
